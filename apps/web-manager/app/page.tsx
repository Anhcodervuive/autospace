import { DEMO_PORTAL_ACCESS } from '@autospace/util/constants';
import { DemoPortalAccessPanel } from '@autospace/ui/components/molecules/DemoPortalAccess';
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsManager } from '@autospace/ui/components/organisms/IsManager';
import { ListGarages } from '@autospace/ui/components/organisms/ListGarages';
import {
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
  const portal = DEMO_PORTAL_ACCESS.find(
    (item) => item.audience === 'manager',
  )!;

  return (
    <main className="p-8">
      <IsLoggedIn
        notLoggedIn={
          <DemoPortalAccessPanel
            title="Manager demo access"
            description="Use the seeded manager account to inspect garages, valets, and booking operations."
            portals={[portal]}
            loginHref="/login"
            loginLabel="Log in as manager"
          />
        }
      >
        <IsManager>
          {(companyId) => <ListGarages companyId={companyId} page={page} />}
        </IsManager>
      </IsLoggedIn>
    </main>
  );
}
