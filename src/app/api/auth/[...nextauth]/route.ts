import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Only HTTP method exports are allowed in Next.js 15 route files.
// authOptions lives in @/lib/auth so it can be imported elsewhere
// (e.g. getServerSession(authOptions)) without polluting this route's exports.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
