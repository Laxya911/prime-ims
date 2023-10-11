import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import User from "@/models/userModel";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    try {
      
      await connectDB();
      const { role, companyId } = session.user;
      let users;
      if (role === "superadmin") {
        users = await User.find();
      } else {
        users = await User.find({ companyId });
      }
      return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const { companyId, name, email, userName, contact_no } =
      await request.json();

    await connectDB();
    // Check if email or userName already exist
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      console.log("User Already Exits");
      return new NextResponse("Email or User already exists", {
        status: 400, // Bad Request
      });
    }
    const newUser = new User({
      companyId,
      name,
      email,
      userName,
      contact_no,
    });
    console.log(newUser);
    try {
      await newUser.save();
      return new NextResponse("User has been Added", {
        status: 201,
      });
    } catch (err) {
      const error = err as Error;
      return new NextResponse(error.message, {
        status: 500,
      });
    }
  }
};
