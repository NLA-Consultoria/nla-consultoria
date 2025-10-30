// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const CANONICAL_HOST = 'licitacao.nlaconsultoria.com.br'

export function middleware(req: NextRequest) {
  const xfProto = req.headers.get('x-forwarded-proto') ?? ''
  const xfHost = req.headers.get('x-forwarded-host') ?? ''
  const host = xfHost || req.headers.get('host') || ''
  const isHttps = xfProto === 'https'

  // sempre constrói a URL alvo do zero (sem herdar porta)
  const target = () =>
    new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL_HOST}`)

  // 1) força HTTPS
  if (!isHttps) {
    return NextResponse.redirect(target(), 308)
  }

  // 2) www → canônico
  if (host === `www.${CANONICAL_HOST}`) {
    return NextResponse.redirect(target(), 308)
  }

  // 3) qualquer outro host → canônico
  if (host !== CANONICAL_HOST) {
    return NextResponse.redirect(target(), 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
