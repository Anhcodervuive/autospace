import { getApolloServerClient } from '@autospace/network/src/config/apollo-server';
import { SearchGaragesDocument } from '@autospace/network/src/gql/generated';

export default async function Home() {
  const client = await getApolloServerClient();
  const { data: queryData } = await client.query({
    query: SearchGaragesDocument,
    variables: {
      dateFilter: { end: '2026-04-02', start: '2026-04-01' },
      locationFilter: {
        ne_lat: 1,
        ne_lng: 1,
        sw_lat: -1,
        sw_lng: -1,
      },
      slotsFilter: {
        pricePerHour: { gte: 0 },
      },
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <main className="p-8">
      <pre>{JSON.stringify(queryData, null, 2)}</pre>
    </main>
  );
}
