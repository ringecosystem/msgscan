import { ponder } from "@/generated";
import { onMessageSent, onMessageRecv } from "./msgport_helper";

ponder.on("ORMPUpgradeablePort:MessageSent", async ({ event, context }) => {
  await onMessageSent("ormp", event, context)
})

ponder.on("ORMPUpgradeablePort:MessageRecv", async ({ event, context }) => {
  await onMessageRecv("ormp", event, context)
})
