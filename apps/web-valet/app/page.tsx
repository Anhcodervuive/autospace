import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsValet } from '@autospace/ui/components/organisms/IsValet';
import { ValetHome } from '@autospace/ui/components/templates/ValetHome';
import {
  parseEnumParam,
  parsePositiveIntParam,
  SearchParamsRecord,
} from '@autospace/ui/components/utils/searchParams';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const params = await searchParams;
  const page = parsePositiveIntParam(params.page);
  const tab = parseEnumParam(params.tab, ['pickup', 'drop'] as const, 'pickup');

  return (
    <main>
      <IsLoggedIn>
        {(uid) => (
          <IsValet uid={uid}>
            <ValetHome page={page} tab={tab} />
          </IsValet>
        )}
      </IsLoggedIn>
    </main>
  );
}
