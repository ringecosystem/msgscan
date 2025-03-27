import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ORMPUpgradeablePortMessageSent {
    constructor(props?: Partial<ORMPUpgradeablePortMessageSent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BigIntColumn_({nullable: false})
    blockNumber!: bigint

    @StringColumn_({nullable: false})
    transactionHash!: string

    @BigIntColumn_({nullable: false})
    blockTimestamp!: bigint

    @BigIntColumn_({nullable: false})
    chainId!: bigint

    @StringColumn_({nullable: false})
    msgId!: string

    @StringColumn_({nullable: false})
    fromDapp!: string

    @BigIntColumn_({nullable: false})
    toChainId!: bigint

    @StringColumn_({nullable: false})
    toDapp!: string

    @StringColumn_({nullable: false})
    message!: string

    @StringColumn_({nullable: false})
    params!: string
}
