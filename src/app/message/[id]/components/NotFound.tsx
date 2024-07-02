import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{ minHeight: 'calc(100vh - var(--header-height) - var(--footer-height))' }}
    >
      <div>
        <h3 className="text-center text-xl text-foreground">Message Not Found</h3>
        <Separator className="my-2" />
        <div className="flex flex-col items-center">
          <p className="text-center text-sm text-secondary-foreground">
            The transaction details you are looking for cannot be found or may no longer exist.
          </p>
          <p className="text-center text-sm text-secondary-foreground">
            Please verify the params or try another search.
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

export default NotFound;
