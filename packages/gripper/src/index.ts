import "reflect-metadata";

import { Command, Option } from "commander";
import { Container } from "typedi";
import { GripperServer } from "./gripper";

const program = new Command();

program.name("gripper").description("msgport indexer gripper").version("0.1.0");

program
  .command("server")
  .description("start server")
  .addOption(
    new Option("--host <string>", "listen host")
      .default("127.0.0.1", "default host")
      .env("HOST")
  )
  .addOption(
    new Option("-t, --port <number>", "listen port")
      .default(6000, "default port")
      .env("PORT")
  )
  .action(async (options) => {
    const c = Container.get(GripperServer);
    await c.listen({
      host: options.host,
      port: options.port,
    });
  });

program.parse(process.argv);

process.on("uncaughtException", (error) => {
  console.error(error);
});
