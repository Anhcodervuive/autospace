import { ManageValets } from '@autospace/ui/components/templates/ManageValets';
import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';

export default function Page() {
  return (
    <IsLoggedIn>
      <ManageValets />
    </IsLoggedIn>
  );
}
