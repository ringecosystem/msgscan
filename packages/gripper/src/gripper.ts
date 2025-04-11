import { Service } from "typedi";
import { GripperHelpers, RuntimeProfile } from "./patch/helpers";
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { DEFINED_LOGGER_RULE } from "./patch/logger";
import {
  createSchema,
  createYoga,
  useExecutionCancellation,
} from "graphql-yoga";
import { GripperContext, GripperGraphqlContext } from "./patch/context";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from "path";
import { IndexerTask } from "./task/indexer";
import { GripperRunnerOptions } from "./types";

@Service({})
export class GripperServer {
  constructor(
    private readonly gripperGraphqlContext: GripperGraphqlContext,
    private readonly indexerTask: IndexerTask
  ) {}

  async listen(options: { host: string; port: number }) {
    const profile: RuntimeProfile = GripperHelpers.runtimeProfile();

    const fastify = Fastify({
      logger: DEFINED_LOGGER_RULE[profile] ?? true,
      disableRequestLogging: profile == RuntimeProfile.Production,
      ignoreTrailingSlash: true,
      ignoreDuplicateSlashes: true,
    });
    const runnerOptions: GripperRunnerOptions = { fastify, profile };
    try {
      await this.richs(runnerOptions);
      await this.yoga(runnerOptions);
      await fastify.listen({ host: options.host, port: options.port });
      await this.scheduler(runnerOptions);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }

  private async richs(options: GripperRunnerOptions) {
    // const { fastify } = options;
  }

  private async scheduler(options: GripperRunnerOptions) {
    const { fastify } = options;
    fastify.ready().then(() => {
      this.indexerTask.start(options);
    });
  }

  private async yoga(options: GripperRunnerOptions) {
    const { fastify, profile } = options;
    let schema = createSchema<GripperContext>({
      typeDefs: [
        ...loadFilesSync([path.join(__dirname, "graphql")], {
          extensions: ["graphql"],
        }),
      ],
      resolvers: {
        Query: {
          // orgPage: (_, params, __) => this.orgResolver.page(_, params, __),
        },
        // Mutation: {},
        // Subscription: {},
      },
    });

    const graphQLServer = createYoga<{
      req: FastifyRequest;
      reply: FastifyReply;
    }>({
      plugins: [useExecutionCancellation()],
      maskedErrors: profile == RuntimeProfile.Production,
      cors: {
        origin: "*",
        credentials: true,
        allowedHeaders: ["x-msgscan-token"],
      },
      healthCheckEndpoint: "/live",
      schema,
      context: (origin) =>
        this.gripperGraphqlContext.gripperGraphqlContext(origin, fastify),
      // Integrate Fastify Logger to Yoga
      logging: {
        debug: (...args) => {
          for (const arg of args) fastify.log.debug(arg);
        },
        info: (...args) => {
          for (const arg of args) fastify.log.info(arg);
        },
        warn: (...args) => {
          for (const arg of args) fastify.log.warn(arg);
        },
        error: (...args) => {
          for (const arg of args) fastify.log.error(arg);
        },
      },
    });

    fastify.route({
      // Bind to the Yoga's endpoint to avoid rendering on any path
      url: graphQLServer.graphqlEndpoint,
      method: ["GET", "POST", "OPTIONS"],
      handler: async (req, reply) => {
        // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
        const response = await graphQLServer.handleNodeRequestAndResponse(
          req,
          reply,
          {
            req,
            reply,
          }
        );
        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        reply.status(response.status);
        reply.send(response.body);

        return reply;
      },
    });
  }
}
