import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {ORMPMessageAccepted} from "./ormpMessageAccepted.model"

@Entity_()
export class MessagePort {
    constructor(props?: Partial<MessagePort>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    protocol!: string

    @StringColumn_({nullable: true})
    payload!: string | undefined | null

    @StringColumn_({nullable: true})
    params!: string | undefined | null

    @IntColumn_({nullable: false})
    status!: number

    @StringColumn_({nullable: true})
    sender!: string | undefined | null

    @BigIntColumn_({nullable: true})
    sourceChainId!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sourceBlockNumber!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    sourceBlockTimestamp!: bigint | undefined | null

    @StringColumn_({nullable: true})
    sourceTransactionHash!: string | undefined | null

    @IntColumn_({nullable: true})
    sourceTransactionIndex!: number | undefined | null

    @IntColumn_({nullable: true})
    sourceLogIndex!: number | undefined | null

    @StringColumn_({nullable: true})
    sourceDappAddress!: string | undefined | null

    @StringColumn_({nullable: true})
    sourcePortAddress!: string | undefined | null

    @BigIntColumn_({nullable: true})
    targetChainId!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    targetBlockNumber!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    targetBlockTimestamp!: bigint | undefined | null

    @StringColumn_({nullable: true})
    targetTransactionHash!: string | undefined | null

    @IntColumn_({nullable: true})
    targetTransactionIndex!: number | undefined | null

    @IntColumn_({nullable: true})
    targetLogIndex!: number | undefined | null

    @StringColumn_({nullable: true})
    targetDappAddress!: string | undefined | null

    @StringColumn_({nullable: true})
    targetPortAddress!: string | undefined | null

    @Index_()
    @ManyToOne_(() => ORMPMessageAccepted, {nullable: true})
    ormp!: ORMPMessageAccepted | undefined | null
}
