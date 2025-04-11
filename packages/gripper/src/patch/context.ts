import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Service } from "typedi";

export interface GripperContext {
  req: FastifyRequest;
  reply: FastifyReply;
  fastify: FastifyInstance;
}

@Service({})
export class GripperGraphqlContext {
  gripperGraphqlContext({ req, reply }, fastify): GripperContext {
    return {
      req,
      reply,
      fastify,
    };
  }
}
