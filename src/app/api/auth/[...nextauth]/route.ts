import { authOptions } from "../options";
import NextAuth from "next-auth/next";



// **Fix: Explicitly export as Next.js route handler**
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
