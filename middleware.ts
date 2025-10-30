// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  // redireciona www.licitacao → licitacao (preserva path e query)
  if (host === 'www.licitacao.nlaconsultoria.com.br') {
    const url = new URL(req.url)
    url.host = 'licitacao.nlaconsultoria.com.br'
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

