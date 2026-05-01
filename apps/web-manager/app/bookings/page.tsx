import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsManager } from '@autospace/ui/components/organisms/IsManager';
import { ListGarageBookings } from '@autospace/ui/components/templates/ListGarageBookings';
import {
  parseEnumParam,
  parsePositiveIntParam,
  parseStringParam,
  SearchParamsRecord,
} from '@autospace/ui/components/utils/searchParams';

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) => {
  const params = await searchParams;

  const garageId = Number(params.garageId);
  const page = parsePositiveIntParam(params.page);
  const tab = parseEnumParam(params.tab, ['in', 'out', 'resolved'] as const, 'in');
  const query = parseStringParam(params.q);

  return (
    <main>
      <IsLoggedIn>
        <IsManager>
          <ListGarageBookings garageId={garageId} page={page} query={query} tab={tab} />
        </IsManager>
      </IsLoggedIn>
    </main>
  );
};

export default Page;
