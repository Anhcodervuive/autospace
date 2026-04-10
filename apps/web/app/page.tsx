'use client';

import { useQuery } from '@apollo/client/react';
import { CompaniesDocument } from '@autospace/network/src/gql/generated';

export default function Home() {
  const { data: queryData } = useQuery(CompaniesDocument, { variables: {} });

  return (
    <main className="p-8">
      {queryData?.companies.map((company) => (
        <div key={company.id} className="">
          {company.id}
        </div>
      ))}
    </main>
  );
}
