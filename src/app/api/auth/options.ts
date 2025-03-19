import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/lib/db/models/User";
import { Profile } from "next-auth";
import {connectDB} from "@/lib/db/connect";

// Extend session user type to include 'id'
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

interface ExtendedProfile extends Profile {
    picture?: string; // Manually add picture property
}

export const authOptions: NextAuthOptions = {        
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async session({ session }) {
            try {
                await connectDB();
                const sessionUser = await User.findOne({ email: session.user?.email });

                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }

                return session;
            } catch (error) {
                console.error("Session callback error:", error);
                return session;
            }
        },  
        async signIn({ profile }: { profile?: ExtendedProfile }) {
            try {
                if (!profile?.email) {
                    throw new Error("No profile email found");
                }
        
                await connectDB();
        
                // Check if user already exists
                let user = await User.findOne({ email: profile.email });
        
                // If not, create a new user
                if (!user) {
                    user = await User.create({
                        googleId: profile.sub, // ✅ Google's unique ID
                        name: profile.name, // ✅ Store full name
                        email: profile.email,
                        username: profile.name?.replace(/\s+/g, "").toLowerCase(),
                        image: profile.picture, // ✅ Fix incorrect field
                    });
                }
        
                return true;
            } catch (error) {
                console.error("Sign-in error:", error);
                return false;
            }
        }
        
    },
};