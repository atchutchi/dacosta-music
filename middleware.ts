import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Simple middleware that doesn't do authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [], // No routes to match
}
