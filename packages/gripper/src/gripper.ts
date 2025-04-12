import { Service } from "typedi";
import { GripperHelpers, RuntimeProfile } from "./patch/helpers";
import { IndexerTask } from "./task/indexer";
import { PrismaClient } from "@prisma/client";

@Service({})
export class GripperServer {
  constructor(private readonly indexerTask: IndexerTask) {}

  async start(options: {}) {
    const profile: RuntimeProfile = GripperHelpers.runtimeProfile();

    const prismaClient = new PrismaClient({});

    await this.indexerTask.start({ profile, prisma: prismaClient });
  }
}
