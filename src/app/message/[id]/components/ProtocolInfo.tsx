import { protocols } from '@/config/protocols';
import { MessagePort } from '@/graphql/type';

interface ProtocolInfoProps {
  protocol?: MessagePort['protocol'];
}
const ProtocolInfo = ({ protocol }: ProtocolInfoProps) => {
  const currentProtocol = protocols?.find((item) => item.value === protocol);
  const ProtocolIcon = currentProtocol?.icon;

  return protocol && ProtocolIcon ? (
    <div className="flex items-center gap-[0.31rem]">
      <ProtocolIcon />
      <span className="text-sm">{currentProtocol?.title}</span>
    </div>
  ) : null;
};

export default ProtocolInfo;
