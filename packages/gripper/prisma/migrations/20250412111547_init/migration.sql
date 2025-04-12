-- CreateTable
CREATE TABLE "sync_position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cursor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "message_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" INTEGER NOT NULL,
    "inflight" INTEGER NOT NULL,
    "failed" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "message_port" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "msg_id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "source_chain_id" TEXT,
    "source_block_number" INTEGER,
    "source_block_timestamp" DATETIME,
    "source_transaction_hash" TEXT,
    "source_log_index" INTEGER,
    "source_dapp_address" TEXT,
    "target_chain_id" INTEGER,
    "target_dapp_address" TEXT,
    "message_encoded" TEXT,
    "sender" TEXT,
    "target_block_number" INTEGER,
    "target_block_timestamp" DATETIME,
    "target_transaction_hash" TEXT,
    "target_port_address" TEXT,
    "ctime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utime" DATETIME NOT NULL
);
