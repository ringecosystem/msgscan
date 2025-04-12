import { PrismaClient } from "@prisma/client";
import { RuntimeProfile } from "./patch/helpers";

export interface GripperRunnerOptions {
  profile: RuntimeProfile;
  prisma: PrismaClient;
}
