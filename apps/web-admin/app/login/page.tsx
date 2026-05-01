import { LoginForm } from '@autospace/ui/components/templates/LoginForm';
import { AuthLayout } from '@autospace/ui/components/molecules/AuthLayout';

export default function Page() {
  return (
    <AuthLayout title={'Login'}>
      <LoginForm />
    </AuthLayout>
  );
}
