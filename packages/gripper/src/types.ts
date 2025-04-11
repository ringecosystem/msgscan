import { FastifyInstance } from "fastify";
import { RuntimeProfile } from "./patch/helpers";

export interface GripperRunnerOptions {
  fastify: FastifyInstance;
  profile: RuntimeProfile;
}
