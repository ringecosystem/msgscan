import { Service } from "typedi";
import { GripperHelpers, RuntimeProfile } from "./patch/helpers";
import { IndexerTask } from "./task/indexer";
import Fastify, { FastifyInstance } from "fastify";
import { DEFINED_LOGGER_RULE } from "./patch/logger";
import { postgraphile } from "postgraphile";
import fastifyExpress from "@fastify/express";
import fastifyPrisma from "@joggr/fastify-prisma";
import { GripperRunnerOptions } from "./types";

@Service({})
export class GripperServer {
  constructor(private readonly indexerTask: IndexerTask) {}

  async listen(options: { host: string; port: number }) {
    const profile: RuntimeProfile = GripperHelpers.runtimeProfile();

    const fastify = Fastify({
      logger: DEFINED_LOGGER_RULE[profile] ?? true,
      disableRequestLogging: profile == RuntimeProfile.Production,
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
    });

    try {
      await this.richs(fastify);
      await fastify.listen({ host: options.host, port: options.port });
      await this.task({ fastify, profile });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }

  private async richs(fastify: FastifyInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not set");
    }

    await fastify.register(fastifyExpress);
    await fastify.register(fastifyPrisma);

    const postgraphileMiddleware = postgraphile(databaseUrl, "public", {
      graphiql: true,
      enhanceGraphiql: true,
    });
    fastify.use(postgraphileMiddleware);
  }

  async task(options: GripperRunnerOptions) {
    await this.indexerTask.start(options);
  }
}
