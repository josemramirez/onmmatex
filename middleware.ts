import { auth } from "@/services/auth";
import {
  authRedirectTo,
  signOutRedirectTo,
  unauthRedirectTo,
} from "./config/auth-config";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL(unauthRedirectTo, req.nextUrl.origin);
    return Response.redirect(redirectUrl);
  }

  if (
    (!req.auth || process.env.ADMIN_EMAIL !== req.auth.user?.email) &&
    req.nextUrl.pathname.startsWith("/admin")
  ) {
    const redirectUrl = new URL(signOutRedirectTo, req.nextUrl.origin);
    return Response.redirect(redirectUrl);
  }

  if (req.auth && req.nextUrl.pathname.startsWith("/auth/login")) {
    const redirectUrl = new URL(authRedirectTo, req.nextUrl.origin);
    return Response.redirect(redirectUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
