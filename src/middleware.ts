import { type NextRequest, NextResponse } from "next/server";

const APEX_HOST = "nishantharkut.tech";
const CANONICAL_HOST = "www.nishantharkut.tech";

export function middleware(request: NextRequest) {
  const requestHost = request.headers.get("host")?.split(":", 1)[0].toLowerCase();
  if (requestHost !== APEX_HOST) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.protocol = "https";
  destination.hostname = CANONICAL_HOST;
  destination.port = "";

  return NextResponse.redirect(destination, 307);
}

export const config = {
  matcher: ["/((?!sw\\.js$|_next/static|_next/image|favicon.ico).*)"],
};
