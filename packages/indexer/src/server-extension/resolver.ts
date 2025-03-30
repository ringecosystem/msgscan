import { Arg, Field, ObjectType, Query, Resolver } from "type-graphql";
import type { EntityManager } from "typeorm";
import { MessagePort, ORMPHashImported } from "../model";

// @ObjectType()
// export class MyQueryResult {
//   @Field(() => Number, { nullable: false })
//   total!: number;

//   @Field(() => Number, { nullable: false })
//   max!: number;

//   constructor(props: Partial<MyQueryResult>) {
//     Object.assign(this, props);
//   }
// }

@ObjectType()
export class MessagePortResult {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: false })
  protocol!: string;

  @Field(() => String, { nullable: true })
  payload!: string | undefined | null;

  @Field(() => String, { nullable: true })
  params!: string | undefined | null;

  @Field(() => Number, { nullable: false })
  status!: number;

  @Field(() => String, { nullable: true })
  sender!: string | undefined | null;

  @Field(() => BigInt, { nullable: true })
  sourceChainId!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  sourceBlockNumber!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  sourceBlockTimestamp!: bigint | undefined | null;

  @Field(() => String, { nullable: true })
  sourceTransactionHash!: string | undefined | null;

  @Field(() => Number, { nullable: true })
  sourceTransactionIndex!: number | undefined | null;

  @Field(() => Number, { nullable: true })
  sourceLogIndex!: number | undefined | null;

  @Field(() => String, { nullable: true })
  sourceDappAddress!: string | undefined | null;

  @Field(() => String, { nullable: true })
  sourcePortAddress!: string | undefined | null;

  @Field(() => BigInt, { nullable: true })
  targetChainId!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  targetBlockNumber!: bigint | undefined | null;

  @Field(() => BigInt, { nullable: true })
  targetBlockTimestamp!: bigint | undefined | null;

  @Field(() => String, { nullable: true })
  targetTransactionHash!: string | undefined | null;

  @Field(() => Number, { nullable: true })
  targetTransactionIndex!: number | undefined | null;

  @Field(() => Number, { nullable: true })
  targetLogIndex!: number | undefined | null;

  @Field(() => String, { nullable: true })
  targetDappAddress!: string | undefined | null;

  @Field(() => String, { nullable: true })
  targetPortAddress!: string | undefined | null;
}

@Resolver()
export class MyResolver {
  // Set by depenency injection
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [MessagePortResult])
  async messsages(@Arg("limit") limit: number, @Arg("offset") offset: number): Promise<MessagePortResult[]> {
    const manager = await this.tx();
    // execute custom SQL query
    const results = await manager.getRepository(ORMPHashImported).query(
      `
      select
      mp.*,
      case 
          when od.dispatch_result is true then 1
          when od.dispatch_result is false then 2
          else mp._msgport_status
      end as status
      from (
      select
      coalesce (ms.msg_id, mr.msg_id) as id,
      coalesce (ms.msg_id, mr.msg_id) as msg_id,
      'ormp' as protocol,
      ms.chain_id as source_chain_id,
      ms.block_number as source_block_number,
      ms.block_timestamp as source_block_timestamp,
      ms.transaction_hash as source_transaction_hash,
      -- ms.transaction_index as source_transaction_index,
      -- ms.log_index as source_log_index,
      -- ms.port_address as source_port_address,
      ms.from_dapp as source_dapp_address,
      ms.to_chain_id as target_chain_id,
      ms.to_dapp as target_dapp_address,
      case 
          when mr.result is true then 1
          when mr.result is false then 2
          else 0
      end as _msgport_status,
      mr.chain_id as target_chain_id,
      mr.block_number as target_block_number,
      mr.block_timestamp as target_block_timestamp,
      mr.transaction_hash as target_transaction_hash
      -- mr.transaction_index as target_transaction_index,
      -- mr.log_index as target_log_index,
      -- mr.port_address as target_port_address,
      from ormp_upgradeable_port_message_sent as ms
      full join ormp_upgradeable_port_message_recv as mr on ms.msg_id = mr.msg_id 
      ) as mp
      left join ormp_message_dispatched as od on mp.msg_id=od.msg_hash 
      order by mp.source_block_timestamp desc
      limit 100
      `
    );
    return results.map((item: any) => {
      const mpr = new MessagePortResult();
      mpr.id = item.id;
      mpr.protocol = item.protocol;
      mpr.payload = item.payload;
      mpr.params = item.params;
      mpr.status = item.status;
      mpr.sender = item.sender;
      mpr.sourceChainId = item.source_chain_id;
      mpr.sourceBlockNumber = item.source_block_number;
      mpr.sourceBlockTimestamp = item.source_block_timestamp;
      mpr.sourceTransactionHash = item.source_transaction_hash;
      mpr.sourceTransactionIndex = item.source_transaction_index;
      mpr.sourceLogIndex = item.source_log_index;
      mpr.sourceDappAddress = item.source_dapp_address;
      mpr.sourcePortAddress = item.source_port_address;
      mpr.targetChainId = item.target_chain_id;
      mpr.targetBlockNumber = item.target_block_number;
      mpr.targetBlockTimestamp = item.target_block_timestamp;
      mpr.targetTransactionHash = item.target_transaction_hash;
      mpr.targetTransactionIndex = item.target_transaction_index;
      mpr.targetLogIndex = item.target_log_index;
      mpr.targetDappAddress = item.target_dapp_address;
      mpr.targetPortAddress = item.target_port_address;
      return mpr;
    });
  }
}
