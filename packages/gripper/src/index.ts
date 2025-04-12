import "reflect-metadata";

import { Command, Option } from "commander";
import { Container } from "typedi";
import { GripperServer } from "./gripper";

const program = new Command();

program.name("gripper").description("msgport indexer gripper").version("0.1.0");

program
  .command("crawl")
  .description("start crawl")
  .action(async (options) => {
    const c = Container.get(GripperServer);
    await c.start({});
  });

program.parse(process.argv);

process.on("uncaughtException", (error) => {
  console.error(error);
});
