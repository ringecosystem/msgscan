import { RuntimeProfile } from "./patch/helpers";
import { FastifyInstance } from "fastify";

export interface GripperRunnerOptions {
  fastify: FastifyInstance;
  profile: RuntimeProfile;
}
