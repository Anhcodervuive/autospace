'use client';

import { IsLoggedIn } from '@autospace/ui/components/organisms/IsLoggedIn';
import { IsManager } from '@autospace/ui/components/organisms/IsManager';

export default function Home() {
  return (
    <main>
      <IsLoggedIn>
        <IsManager>Hello manager</IsManager>
      </IsLoggedIn>
    </main>
  );
}
