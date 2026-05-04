import Link from 'next/link';

const FEATURE_ITEMS = [
  {
    title: 'Tìm chỗ đỗ nhanh chóng',
    description:
      'Tìm garage phù hợp theo khu vực, thời gian và mức giá chỉ trong vài bước đơn giản.',
  },
  {
    title: 'Đặt lịch linh hoạt',
    description:
      'Theo dõi trạng thái booking hiện tại và lịch sử đặt chỗ ngay trong mục Bookings.',
  },
  {
    title: 'Quản lý dễ dàng',
    description:
      'Lưu lại thông tin cần thiết và quay lại các thao tác quen thuộc mà không mất thời gian.',
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
          Đặt chỗ đỗ xe thuận tiện cho mọi hành trình
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Autospace giúp bạn tìm kiếm bãi đỗ và quản lý lịch đặt chỗ một cách trực quan.
          Bắt đầu bằng cách tìm chỗ trống gần bạn hoặc xem lại các booking đã tạo.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black"
          >
            Tìm bãi đỗ
          </Link>
          <Link
            href="/bookings"
            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Xem bookings
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
