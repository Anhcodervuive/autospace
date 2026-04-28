import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsManager } from '@autospace/ui/components/organisms/IsManager';
import { ListGarageBookings } from '@autospace/ui/components/templates/ListGarageBookings';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  const garageId = Number(params.garageId);
  console.log(garageId);

  return (
    <main>
      <IsLoggedIn>
        <IsManager>
          <ListGarageBookings garageId={garageId} />
        </IsManager>
      </IsLoggedIn>
    </main>
  );
};

export default Page;
