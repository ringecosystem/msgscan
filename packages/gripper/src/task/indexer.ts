import { setTimeout } from "timers/promises";
import { Service } from "typedi";
import { GripperRunnerOptions } from "../types";

@Service({})
export class IndexerTask {
  constructor() {}

  async start(options: GripperRunnerOptions) {
    while (true) {
      await this.run(options);
      await setTimeout(1000);
    }
  }

  private async run(options: GripperRunnerOptions) {
    const { fastify } = options;
    fastify.log.info("running indexer task");
    
  }
}
