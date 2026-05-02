import { IsAdmin } from '@autospace/ui/components/organisms/IsAdmin'
import { AdminHome } from '@autospace/ui/components/templates/AdminHome'
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import {
  parsePositiveIntParam,
  SearchParamsRecord,
} from '@autospace/ui/components/utils/searchParams'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>
}) {
  const params = await searchParams
  const page = parsePositiveIntParam(params.page)

  return (
    <main>
      <IsLoggedIn>
        <IsAdmin>
          <AdminHome page={page} />
        </IsAdmin>
      </IsLoggedIn>
    </main>
  )
}
