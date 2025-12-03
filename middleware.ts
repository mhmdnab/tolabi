import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PATH = "/admin";
const EDITOR_PATH = "/editor";
const ATTENDANT_PATH = "/attendant";

const isProtected = (pathname: string) =>
  pathname.startsWith(ADMIN_PATH) ||
  pathname.startsWith(EDITOR_PATH) ||
  pathname.startsWith(ATTENDANT_PATH);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const role = request.cookies.get("role")?.value;

  const isAdminRoute = pathname.startsWith(ADMIN_PATH);
  const isEditorRoute = pathname.startsWith(EDITOR_PATH);
  const isAttendantRoute = pathname.startsWith(ATTENDANT_PATH);

  const authorized =
    (isAdminRoute && role === "superadmin") ||
    (isEditorRoute && role === "editor") ||
    (isAttendantRoute && role === "attendant");

  if (authorized) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*", "/attendant/:path*"],
};
