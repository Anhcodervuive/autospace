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
    <main>
      123
      {queryData?.companies.map((company) => (
        <div key={company.id}>{company.id}</div>
      ))}
    </main>
  );
}
