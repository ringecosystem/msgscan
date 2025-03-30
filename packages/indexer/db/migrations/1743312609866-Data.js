module.exports = class Data1743312609866 {
    name = 'Data1743312609866'

    async up(db) {
        await db.query(`CREATE TABLE "ormp_hash_imported" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "transaction_hash" text NOT NULL, "block_timestamp" numeric NOT NULL, "src_chain_id" numeric NOT NULL, "target_chain_id" numeric NOT NULL, "oracle" text NOT NULL, "channel" text NOT NULL, "msg_index" numeric NOT NULL, "hash" text NOT NULL, CONSTRAINT "PK_f77b5e871e898bb5858336c2e28" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "ormp_message_accepted" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "transaction_hash" text NOT NULL, "block_timestamp" numeric NOT NULL, "msg_hash" text NOT NULL, "channel" text NOT NULL, "index" numeric NOT NULL, "from_chain_id" numeric NOT NULL, "from" text NOT NULL, "to_chain_id" numeric NOT NULL, "to" text NOT NULL, "gas_limit" numeric NOT NULL, "encoded" text NOT NULL, "oracle" text, "oracle_assigned" boolean, "oracle_assigned_fee" numeric, "relayer" text, "relayer_assigned" boolean, "relayer_assigned_fee" numeric, CONSTRAINT "PK_7b118199a6f5a209125bcd1f150" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "ormp_message_assigned" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "transaction_hash" text NOT NULL, "block_timestamp" numeric NOT NULL, "msg_hash" text NOT NULL, "oracle" text NOT NULL, "relayer" text NOT NULL, "oracle_fee" numeric NOT NULL, "relayer_fee" numeric NOT NULL, "params" text NOT NULL, CONSTRAINT "PK_16d7e06a3c8a8aedd8ac420e694" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "ormp_message_dispatched" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" numeric NOT NULL, "transaction_hash" text NOT NULL, "target_chain_id" numeric NOT NULL, "msg_hash" text NOT NULL, "dispatch_result" boolean NOT NULL, CONSTRAINT "PK_2454489075c18ebbb272ccabfd0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "ormp_upgradeable_port_message_recv" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "transaction_hash" text NOT NULL, "block_timestamp" numeric NOT NULL, "chain_id" numeric NOT NULL, "msg_id" text NOT NULL, "result" boolean NOT NULL, "return_data" text NOT NULL, CONSTRAINT "PK_716733246c53f7e3a58399092ec" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "ormp_upgradeable_port_message_sent" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "transaction_hash" text NOT NULL, "block_timestamp" numeric NOT NULL, "chain_id" numeric NOT NULL, "msg_id" text NOT NULL, "from_dapp" text NOT NULL, "to_chain_id" numeric NOT NULL, "to_dapp" text NOT NULL, "message" text NOT NULL, "params" text NOT NULL, CONSTRAINT "PK_fff9813f39bec0b0e5a7a22cee7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "signature_pub_signature_submittion" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "transaction_hash" text NOT NULL, "block_timestamp" numeric NOT NULL, "chain_id" numeric NOT NULL, "channel" text NOT NULL, "signer" text NOT NULL, "msg_index" numeric NOT NULL, "signature" text NOT NULL, "data" text NOT NULL, CONSTRAINT "PK_706c9af05be7ea394eec4bec3d9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "message_port" ("id" character varying NOT NULL, "protocol" text NOT NULL, "payload" text, "params" text, "status" integer NOT NULL, "sender" text, "source_chain_id" numeric, "source_block_number" numeric, "source_block_timestamp" numeric, "source_transaction_hash" text, "source_transaction_index" integer, "source_log_index" integer, "source_dapp_address" text, "source_port_address" text, "target_chain_id" numeric, "target_block_number" numeric, "target_block_timestamp" numeric, "target_transaction_hash" text, "target_transaction_index" integer, "target_log_index" integer, "target_dapp_address" text, "target_port_address" text, "ormp_id" character varying, CONSTRAINT "PK_e917370343d7b24bd0b56d5c423" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1ed27219f90342d48bcecac970" ON "message_port" ("ormp_id") `)
        await db.query(`CREATE TABLE "message_progress" ("id" character varying NOT NULL, "amount" numeric NOT NULL, CONSTRAINT "PK_d40ca3a0dccc3e82f264a56a0aa" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "message_port" ADD CONSTRAINT "FK_1ed27219f90342d48bcecac9702" FOREIGN KEY ("ormp_id") REFERENCES "ormp_message_accepted"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "ormp_hash_imported"`)
        await db.query(`DROP TABLE "ormp_message_accepted"`)
        await db.query(`DROP TABLE "ormp_message_assigned"`)
        await db.query(`DROP TABLE "ormp_message_dispatched"`)
        await db.query(`DROP TABLE "ormp_upgradeable_port_message_recv"`)
        await db.query(`DROP TABLE "ormp_upgradeable_port_message_sent"`)
        await db.query(`DROP TABLE "signature_pub_signature_submittion"`)
        await db.query(`DROP TABLE "message_port"`)
        await db.query(`DROP INDEX "public"."IDX_1ed27219f90342d48bcecac970"`)
        await db.query(`DROP TABLE "message_progress"`)
        await db.query(`ALTER TABLE "message_port" DROP CONSTRAINT "FK_1ed27219f90342d48bcecac9702"`)
    }
}
