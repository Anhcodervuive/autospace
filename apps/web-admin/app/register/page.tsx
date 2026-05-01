import { RegisterForm } from '@autospace/ui/components/templates/RegisterForm';
import { AuthLayout } from '@autospace/ui/components/molecules/AuthLayout';

export default function Page() {
  return (
    <AuthLayout title={'Login'}>
      <RegisterForm />
    </AuthLayout>
  );
}
