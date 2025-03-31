import ErrorDisplay from '@/components/error-display';

const NotFound = () => {
  return (
    <div
      className="flex w-full items-center justify-center"
      style={{
        height: 'calc(100vh - var(--header-height) - var(--footer-height))'
      }}
    >
      <ErrorDisplay
        title="404 Page not found"
        svgPath="/images/common/404.svg"
        svgPathLight="/images/common/404-light.svg"
        description="The resource reguested could not be found on this server!"
      />
    </div>
  );
};

export default NotFound;
