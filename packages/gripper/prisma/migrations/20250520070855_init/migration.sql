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
    "payload" TEXT,
    "params" TEXT,
    "status" INTEGER NOT NULL,
    "sender" TEXT,
    "source_chain_id" INTEGER,
    "source_block_number" INTEGER,
    "source_block_timestamp" TIMESTAMP(3),
    "source_transaction_hash" TEXT,
    "source_log_index" INTEGER,
    "source_dapp_address" TEXT,
    "source_port_address" TEXT,
    "target_chain_id" INTEGER,
    "target_block_number" INTEGER,
    "target_block_timestamp" TIMESTAMP(3),
    "target_transaction_hash" TEXT,
    "target_log_index" INTEGER,
    "target_dapp_address" TEXT,
    "target_port_address" TEXT,
    "ctime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_port_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_ormp" (
    "id" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "block_timestamp" TIMESTAMP(3) NOT NULL,
    "msg_hash" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "from_chain_id" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to_chain_id" INTEGER NOT NULL,
    "to" TEXT NOT NULL,
    "gas_limit" TEXT NOT NULL,
    "encoded" TEXT NOT NULL,
    "oracle" TEXT,
    "oracle_assigned" BOOLEAN,
    "oracle_assigned_fee" TEXT,
    "relayer" TEXT,
    "relayer_assigned" BOOLEAN,
    "relayer_assigned_fee" TEXT,
    "ctime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_ormp_pkey" PRIMARY KEY ("id")
);
