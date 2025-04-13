-- CreateTable
CREATE TABLE "sync_position" (
    "id" TEXT NOT NULL,
    "cursor" TEXT NOT NULL,

    CONSTRAINT "sync_position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_progress" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "inflight" INTEGER NOT NULL,
    "failed" INTEGER NOT NULL,

    CONSTRAINT "message_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_port" (
    "id" TEXT NOT NULL,
    "msg_id" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "source_chain_id" TEXT,
    "source_block_number" INTEGER,
    "source_block_timestamp" TIMESTAMP(3),
    "source_transaction_hash" TEXT,
    "source_log_index" INTEGER,
    "source_dapp_address" TEXT,
    "target_chain_id" INTEGER,
    "target_dapp_address" TEXT,
    "message_encoded" TEXT,
    "sender" TEXT,
    "target_block_number" INTEGER,
    "target_block_timestamp" TIMESTAMP(3),
    "target_transaction_hash" TEXT,
    "target_port_address" TEXT,
    "ctime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_port_pkey" PRIMARY KEY ("id")
);
