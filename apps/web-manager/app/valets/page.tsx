import { ManageValets } from '@autospace/ui/components/templates/ManageValets';
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsManager } from '@autospace/ui/components/organisms/IsManager';
import {
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

  return (
    <IsLoggedIn>
      <IsManager>
        <ManageValets page={page} />
      </IsManager>
    </IsLoggedIn>
  );
}
