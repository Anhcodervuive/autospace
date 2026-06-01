import Link from 'next/link';
import {
  IconArrowRight,
  IconExternalLink,
  IconKey,
  IconMail,
} from '@tabler/icons-react';
import {
  DemoPortalAccess,
  DemoPortalAudience,
} from '@autospace/util/constants';

const audienceStyles: Record<DemoPortalAudience, string> = {
  admin: 'bg-red-50 text-red-700 ring-red-200',
  manager: 'bg-primary-50 text-primary-900 ring-primary-200',
  valet: 'bg-green-50 text-green-700 ring-green-200',
  client: 'bg-gray-100 text-gray-700 ring-gray-200',
};

const fieldLabelCls =
  'flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500';

export const DemoPortalAccessPanel = ({
  title,
  description,
  portals,
  loginHref,
  loginLabel = 'Go to login',
}: {
  title: string;
  description: string;
  portals: DemoPortalAccess[];
  loginHref?: string;
  loginLabel?: string;
}) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
      <div className="bg-[radial-gradient(circle_at_top_right,_rgba(255,230,109,0.25),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.16),_transparent_28%)] px-6 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Demo access
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
              {description}
            </p>
          </div>
          {loginHref ? (
            <Link
              href={loginHref}
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
              {loginLabel}
            </Link>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
          {portals.map((portal) => (
            <article
              key={portal.url}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-[0_1px_0_rgba(17,24,39,0.04)] backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${audienceStyles[portal.audience]}`}
                  >
                    {portal.title}
                  </span>
                  <p className="mt-3 text-sm font-medium text-gray-900">
                    Seed account
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
                    {portal.account}
                  </p>
                </div>
                <div className="rounded-full border border-gray-200 bg-gray-50 p-2 text-gray-500">
                  <IconExternalLink className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-gray-600">
                {portal.description}
              </p>

              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className={fieldLabelCls}>
                    <IconMail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="mt-2 break-all rounded-xl bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 ring-1 ring-inset ring-gray-200">
                    {portal.email}
                  </p>
                </div>
                <div>
                  <p className={fieldLabelCls}>
                    <IconKey className="h-4 w-4" />
                    Password
                  </p>
                  <p className="mt-2 rounded-xl bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 ring-1 ring-inset ring-gray-200">
                    {portal.password}
                  </p>
                </div>
                <div>
                  <p className={fieldLabelCls}>
                    <IconExternalLink className="h-4 w-4" />
                    Demo URL
                  </p>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-between gap-3 rounded-xl bg-gray-900 px-3 py-2 font-mono text-xs text-white transition hover:bg-black"
                  >
                    <span className="break-all">{portal.url}</span>
                    <IconArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                </div>
              </div>

              <a
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Open portal
                <IconArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
