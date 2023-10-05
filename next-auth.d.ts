// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      image:string;
      name:string;
      email:string;
      companyId: string;
      assignedCompany: string;
      expires: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    companyId: string;
    assignedCompany: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    companyId: string;
    assignedCompany: string;
    expires: string;
  }
}
