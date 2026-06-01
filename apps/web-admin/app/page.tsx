import { DEMO_PORTAL_ACCESS } from '@autospace/util/constants';
import { DemoPortalAccessPanel } from '@autospace/ui/components/molecules/DemoPortalAccess';
import { IsAdmin } from '@autospace/ui/components/organisms/IsAdmin';
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { AdminHome } from '@autospace/ui/components/templates/AdminHome';
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
  const portal = DEMO_PORTAL_ACCESS.find((item) => item.audience === 'admin')!;

  return (
    <main className="p-8">
      <IsLoggedIn
        notLoggedIn={
          <DemoPortalAccessPanel
            title="Admin demo access"
            description="Use the seeded admin account below to verify garages and review the admin dashboard."
            portals={[portal]}
            loginHref="/login"
            loginLabel="Log in as admin"
          />
        }
      >
        <IsAdmin>
          <AdminHome page={page} />
        </IsAdmin>
      </IsLoggedIn>
    </main>
  );
}
