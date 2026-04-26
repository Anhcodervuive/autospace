'use client';

import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';

export default function Home() {
  return (
    <main>
      <IsLoggedIn>{(uid) => <div>{uid}</div>}</IsLoggedIn>
    </main>
  );
}
