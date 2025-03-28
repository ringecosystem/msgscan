import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class ORMPUpgradeablePortMessageRecv {
    logIndex: number | null | undefined
    srcAddress: string | null | undefined
    transaction: any
    constructor(props?: Partial<ORMPUpgradeablePortMessageRecv>) {
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

    @BooleanColumn_({nullable: false})
    result!: boolean

    @StringColumn_({nullable: false})
    returnData!: string
}
