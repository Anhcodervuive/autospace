'use client';

import { useQuery } from '@apollo/client/react';
import {
  CompaniesDocument,
} from '@autospace/network/src/gql/generated';
import { BrandIcon } from '@autospace/ui/components/atoms/BrandIcon';
import { Button } from '@autospace/ui/components/atoms/Button';


export default function Home() {
  const {
    data: queryData,
  } = useQuery(CompaniesDocument, { variables: {} });

  return (
    <main className="p-8">
      <BrandIcon />
      <Button onClick={() => console.log('Hello world!')}>Click me</Button>
      {queryData?.companies.map((company) => (
        <div key={company.id} className="">
          {company.id}
        </div>
      ))}
    </main>
  );
}
