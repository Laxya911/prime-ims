import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import connectDB from "@/utils/dbConnect";
import { signJwtToken } from "@/utils/jwt";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: {
          label: "Username:",
          type: "text",
          placeholder: "your-cool-username",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(
        credentials,
        req
      ): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        companyId:string;
        assignedCompany:string
      } | null> {
        if (!credentials) {
          return null; // No credentials provided
        }
        await connectDB(); 

        // Find the user by userName or email
        const { userName, password } = credentials;
        const user = await User.findOne({
          $or: [{ userName: userName }, { email: userName }],
        });
        // console.log(user);
        if (!user) {
          throw new Error("User Not Found");
        }
        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          throw new Error("Invalid Credentials"); // Password does not match
        }
        else {
          // Return the authenticated user
          if (!user.isActive) {
            throw new Error(
              "Your account is not active. Please contact the administrator for assistance."
            );
          }
          const { password, ...currentUser } = user._doc;
          const accessToken = signJwtToken(currentUser, { expiresIn: "6d" });
          return {
            ...currentUser,
            id: user._id.toString(), // Ensure id is a string
            role: currentUser.role,
            accessToken,
            name: user.name,
            email: user.email,
            companyId :user.companyId,
            assignedCompany: user.assignedCompany.toString(),
          };
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  
  callbacks: {
    // Persist the user role in the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.companyId = user.companyId;
        token.role = user.role;
        token.email = user.email;
        token.id = user.id;
        token.assignedCompany = user.assignedCompany;

      }
      return token;
    },

    // Include the role in the session for client access
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.assignedCompany = token.assignedCompany;
        session.user.companyId = token.companyId;
      }
      return session;
    },
  },
};
