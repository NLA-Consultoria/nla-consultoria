// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const CANONICAL = 'licitacao.nlaconsultoria.com.br'

export function middleware(req: NextRequest) {
  const xfProto = req.headers.get('x-forwarded-proto') || ''
  const xfHost  = req.headers.get('x-forwarded-host') || req.headers.get('host') || ''
  // pega o primeiro host (se vier lista), remove porta se houver
  const host = xfHost.split(',')[0].trim().split(':')[0]
  const isHttps = xfProto === 'https' || req.nextUrl.protocol === 'https:'

  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL}`)

  // força https
  if (!isHttps) return NextResponse.redirect(url, 308)
  // www ou qualquer outro host -> canônico SEM porta
  if (host !== CANONICAL) return NextResponse.redirect(url, 308)

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/.*|favicon.ico|robots.txt|sitemap.xml).*)'],
}
