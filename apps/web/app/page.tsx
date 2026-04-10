'use client';

import { useQuery } from '@apollo/client/react';
import { SearchGaragesDocument } from '@autospace/network/src/gql/generated';

export default function Home() {
  const { data: queryData } = useQuery(SearchGaragesDocument, { variables: {
    dateFilter: { end: '2026-04-02', start: '2026-04-01' },
    locationFilter: { 
      ne_lat: 1,
      ne_lng: 1,
      sw_lat: -1,
      sw_lng: -1,
     },
     slotsFilter: {
      pricePerHour: { gte: 0 },
     }
  } });

  return (
    <main className="p-8">
      <pre>{JSON.stringify(queryData, null, 2)}</pre>
    </main>
  );
}
