import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const Pending = () => {
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
          <p className="text-center text-sm text-secondary-foreground">
            please wait or try again later.
          </p>
          <Button className="mt-4 p-0">
            <Link href="/" className="block w-full px-4 py-2">
              Back Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Pending;
