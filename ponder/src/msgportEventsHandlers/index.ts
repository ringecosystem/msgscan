import { ponder } from "@/generated";
import onMessageSent from './onMessageSent'
import onMessageRecv from './onMessageRecv'

ponder.on("ORMPUpgradeablePort:MessageSent", async ({ event, context }) => {
  await onMessageSent("ormp", event, context)
})

ponder.on("ORMPUpgradeablePort:MessageRecv", async ({ event, context }) => {
  await onMessageRecv("ormp", event, context)
})
