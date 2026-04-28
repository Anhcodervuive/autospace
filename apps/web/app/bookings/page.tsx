import { ListCustomerBookings } from '@autospace/ui/components/templates/ListCustomerBookings'
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn'

export default function Page() {
  return (
    <IsLoggedIn>
      <ListCustomerBookings />
    </IsLoggedIn>
  )
}