import { CodeFont } from '@/config/font';
import { ORMPMessageAccepted } from '@/graphql/type';
import { cn } from '@/lib/utils';

interface OrmpInfoProps {
  ormpInfo: ORMPMessageAccepted;
}

const OrmpInfo = ({ ormpInfo }: OrmpInfoProps) => {
  const data = [
    {
      title: 'msgHash',
      value: ormpInfo?.msgHash || '-'
    },
    {
      title: 'index',
      value: ormpInfo?.index || '-'
    },
    {
      title: 'gaslimit',
      value: ormpInfo?.gasLimit || '-'
    },
    {
      title: 'playload',
      value: ormpInfo?.encoded || '-'
    },
    {
      title: 'channel',
      value: ormpInfo?.channel || '-'
    }
  ];

  return (
    <div className="bg-background">
      {data?.map((item, index) => (
        <div className={cn('flex items-center', 'border-b border-b-muted')} key={index}>
          <div className="w-[7.5rem] shrink-0 border-r border-r-muted p-5 text-xs text-muted-foreground">
            {item?.title}
          </div>
          <div
            className={cn('flex-1 p-5 text-xs text-foreground', CodeFont.className)}
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }}
          >
            {item?.value}
          </div>
        </div>
      ))}
    </div>
  );
};
export default OrmpInfo;
