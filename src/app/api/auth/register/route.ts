import bcrypt from "bcryptjs";
import { NextResponse , NextRequest} from "next/server";
import User from "@/models/userModel";
import connectDB from "@/utils/dbConnect";

export const POST = async (request: NextRequest) => {
  const { name, userName, isActive, assignedCompany, email, number, password, role, companyId } =
    await request.json();

  await connectDB();

  try {
    // Check if email or userName already exist
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      console.log("User Exits");
      return new NextResponse("Email or userName already exists", {
        status: 400, // Bad Request
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({
      name,
      userName,
      email,
      number,
      role,
      isActive,
      assignedCompany,
      companyId,
      password: hashedPassword,
    });

    await newUser.save();

    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    const error = err as Error
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
