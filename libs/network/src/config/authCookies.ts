const nextAuthUrl = process.env.NEXTAUTH_URL ?? ''
const isLocalhost =
    process.env.NODE_ENV === 'development' ||
    /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(nextAuthUrl)

const secureCookies = nextAuthUrl.startsWith('https://')
const rootDomain = process.env.NEXTAUTH_COOKIE_DOMAIN ?? 'karthicktech.com'
const cookieDomain = isLocalhost ? undefined : `.${rootDomain}`

export const nextAuthSessionCookieName = secureCookies
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

export const nextAuthSessionCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: secureCookies,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
}
