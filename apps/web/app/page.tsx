'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import {
  CreateAdminDocument,
  CompaniesDocument,
} from '@autospace/network/src/gql/generated';

export default function Home() {
  // const [, {data}] = useMutation(CreateAdminDocument, { variables: { createAdminInput: { uid: "some-uid" } } });
  const {
    data: queryData,
    loading,
    error,
  } = useQuery(CompaniesDocument, { variables: {} });

  return (
    <main className='bg-primary'>
      123
      {queryData?.companies.map((company) => (
        <div key={company.id} className='text-white bg-gray p-4 rounded mb-2'>
          {company.id}
        </div>
      ))}
    </main>
  );
}
