import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsManager } from '@autospace/ui/components/organisms/IsManager';
import { ListGarages } from '@autospace/ui/components/organisms/ListGarages';
import { parsePositiveIntParam, SearchParamsRecord } from '@autospace/ui/components/utils/searchParams';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const page = parsePositiveIntParam(params.page);

  return (
    <main className="p-8">
      <IsLoggedIn>
        <IsManager>
          {(companyId) => <ListGarages companyId={companyId} page={page} />}
        </IsManager>
      </IsLoggedIn>
    </main>
  );
}
