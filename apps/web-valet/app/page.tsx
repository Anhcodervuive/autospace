import { DEMO_PORTAL_ACCESS } from '@autospace/util/constants';
import { DemoPortalAccessPanel } from '@autospace/ui/components/molecules/DemoPortalAccess';
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
  const portal = DEMO_PORTAL_ACCESS.find((item) => item.audience === 'valet')!;

  return (
    <main className="p-8">
      <IsLoggedIn
        notLoggedIn={
          <DemoPortalAccessPanel
            title="Valet demo access"
            description="Use the seeded valet account below to handle pickup and drop-off trips."
            portals={[portal]}
            loginHref="/login"
            loginLabel="Log in as valet"
          />
        }
      >
        {(uid) => (
          <IsValet uid={uid}>
            <ValetHome page={page} tab={tab} />
          </IsValet>
        )}
      </IsLoggedIn>
    </main>
  );
}
