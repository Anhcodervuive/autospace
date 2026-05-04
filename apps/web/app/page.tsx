import Link from 'next/link';

const FEATURE_ITEMS = [
  {
    title: 'Find parking faster',
    description:
      'Find the right garage by location, time, and budget in just a few simple steps.',
  },
  {
    title: 'Flexible bookings',
    description:
      'Track active reservations and review booking history directly from the Bookings page.',
  },
  {
    title: 'Easy management',
    description:
      'Save essential details and get back to frequent actions without extra hassle.',
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
      <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
        <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          Welcome to Autospace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          Convenient parking for every journey
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Autospace helps you discover parking options and manage reservations in one clear interface.
          Start by searching nearby availability or reviewing your existing bookings.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Find parking
          </Link>
          <Link
            href="/bookings"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View bookings
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {FEATURE_ITEMS.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
