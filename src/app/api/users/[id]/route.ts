import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/dbConnect";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const { id } = params;
    try {
      await connectDB();
      const user = await User.findById(id);

      return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const { id } = params;
    try {
      await connectDB();
      await User.findByIdAndDelete(id);
      return new NextResponse("User has been deleted", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const PUT = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const {
      _id,
      name,
      userName,
      email,
      role,
      isActive,
      assignedCompany,
      companyId,
      password,
    } = await request.json();

    await connectDB();
    try {
      // Check if a new password is provided in the update request
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 5);
      }

      // Prepare the update fields based on the provided data
      const updateFields = {
        name,
        userName,
        email,
        role,
        isActive,
        companyId,
        assignedCompany,
        password,
      };

      // Only include the hashed password in the update if it's provided
      if (hashedPassword) {
        updateFields.password = hashedPassword;
      }

      // Perform the update and get the updated user
      const updatedUser = await User.findByIdAndUpdate(_id, updateFields, {
        new: true,
      });

      console.log(updatedUser);

      if (!updatedUser) {
        return new NextResponse("User not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("User has been updated", {
        status: 200, // OK
      });
    } catch (err) {
      const error = err as Error;
      return new NextResponse(error.message, {
        status: 500, // Internal Server Error
      });
    }
  }
};
