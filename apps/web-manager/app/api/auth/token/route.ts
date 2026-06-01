import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { nextAuthSessionCookieName } from '@autospace/network/src/config/authCookies';

export async function GET(req: NextRequest) {
  const getCookies = await cookies();
  const nextAuthSession = getCookies.get(nextAuthSessionCookieName)?.value || '';

  return NextResponse.json(nextAuthSession);
}
