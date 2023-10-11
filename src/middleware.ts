// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(request: NextRequestWithAuth) {
    if (!request.nextauth?.token) {
      return NextResponse.redirect("/auth/signin");
    }
    // Check the user's role, if needed
    const userRole = request.nextauth.token.role;
    if (
      !userRole ||
      (userRole !== "superadmin" &&
        userRole !== "admin" &&
        userRole !== "normal")
    ) {
      // Redirect to a denied page or do something else as needed
      return NextResponse.redirect("/denied");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = { matcher: ["/"] };
