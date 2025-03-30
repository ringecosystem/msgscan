import { Query, Resolver } from "type-graphql";
import type { EntityManager } from "typeorm";
import { ORMPHashImported } from "../model";

@Resolver()
export class CountResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => Number)
  async totalHashImported(): Promise<number> {
    const manager = await this.tx();
    return await manager.getRepository(ORMPHashImported).count();
  }
}
