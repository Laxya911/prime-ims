"use client";
import { useSession } from "next-auth/react";

const AuthUsers = () => {
  const session = useSession();
  const isSuperAdmin =
    session?.status === "authenticated" &&
    session?.data?.user.role === "superadmin";
  const isAuthorized =
    session?.data?.user?.role === "superadmin" ||
    session?.data?.user?.role === "admin";

  return {
    isSuperAdmin,
    isAuthorized,
    session,
  };
};

export default AuthUsers;
