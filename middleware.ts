// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const CANONICAL_HOST = 'licitacao.nlaconsultoria.com.br'

export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const host = req.headers.get('host') || ''

  // 1) força HTTPS (caso alguém chegue por http)
  if (url.protocol === 'http:') {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  // 2) www → canônico
  if (host === `www.${CANONICAL_HOST}`) {
    url.host = CANONICAL_HOST
    return NextResponse.redirect(url, 308)
  }

  // 3) qualquer outro host que aponte aqui → canônico
  if (host !== CANONICAL_HOST) {
    url.host = CANONICAL_HOST
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

// exclui apenas static internos se quiser
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
