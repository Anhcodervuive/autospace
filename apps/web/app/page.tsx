'use client';

import { useQuery } from '@apollo/client/react';
import { CompaniesDocument } from '@autospace/network/src/gql/generated';
import { BrandIcon } from '@autospace/ui/components/atoms/BrandIcon';
import { Button } from '@autospace/ui/components/atoms/Button';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: queryData } = useQuery(CompaniesDocument, { variables: {} });
  const { data: sessionData } = useSession();

  console.log(sessionData);

  return (
    <main className="p-8">
      <BrandIcon />
      {sessionData ? (
        <div>
          <p>Welcome, {sessionData.user?.email}!</p>

          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <Link href="/login">
            <Button>Go to Login Page</Button>
          </Link>
        </div>
      )}
      {queryData?.companies.map((company) => (
        <div key={company.id} className="">
          {company.id}
        </div>
      ))}
    </main>
  );
}
