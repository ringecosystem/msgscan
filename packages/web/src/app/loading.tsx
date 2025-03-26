import { Separator } from '@/components/ui/separator';

const Page = () => {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: 'calc(100vh - var(--header-height) - var(--footer-height))' }}
    >
      <div>
        <h3 className="animate-ellipsis text-center text-xl text-foreground">Search</h3>
        <Separator className="my-2" />
        <div className="flex flex-col items-center">
          <p className="text-center text-sm text-secondary-foreground">
            Messages sometimes take up to a minute to be indexed.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Page;
