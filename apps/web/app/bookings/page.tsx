import { ListCustomerBookings } from '@autospace/ui/components/templates/ListCustomerBookings';
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import {
  parseEnumParam,
  parsePositiveIntParam,
  SearchParamsRecord,
} from '@autospace/ui/components/utils/searchParams';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const page = parsePositiveIntParam(params.page);
  const tab = parseEnumParam(params.tab, ['past', 'ongoing'] as const, 'ongoing');

  return (
    <IsLoggedIn>
      <ListCustomerBookings page={page} tab={tab} />
    </IsLoggedIn>
  );
}
