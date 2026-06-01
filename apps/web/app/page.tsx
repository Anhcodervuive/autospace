import Link from 'next/link';
import {
  DEMO_PORTAL_ACCESS,
  DEMO_SEED_PASSWORD,
} from '@autospace/util/constants';
import { DemoPortalAccessPanel } from '@autospace/ui/components/molecules/DemoPortalAccess';

const FEATURE_ITEMS = [
  {
    title: 'Customer booking flow',
    description:
      'Search garages, compare locations, and manage trips from one place.',
  },
  {
    title: 'Operational roles',
    description:
      'Admin, manager, and valet portals are separated so each team sees only the work they need.',
  },
  {
    title: 'Demo-ready credentials',
    description:
      'Every portal below comes with a seeded account and the same password for quick testing.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
      <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-900 px-8 py-10 text-white shadow-sm md:px-12 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,214,10,0.25),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.12),_transparent_28%)]" />
        <div className="relative max-w-3xl">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Autospace demo suite
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Parking workflows for clients, admins, managers, and valets.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
            Autospace is a demo parking platform with four separate portals. Use
            the cards below to jump into the right app and log in with the
            matching seeded account.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-black transition hover:bg-primary-600"
            >
              Find parking
            </Link>
            <Link
              href="/bookings"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View bookings
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {FEATURE_ITEMS.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <div className="mt-8">
        <DemoPortalAccessPanel
          title="Choose the portal you want to test"
          description={`All four URLs below use the same demo password: ${DEMO_SEED_PASSWORD}. The seeded accounts match the demo data in apps/api/prisma/seed.ts.`}
          portals={DEMO_PORTAL_ACCESS}
        />
      </div>
    </main>
  );
}
