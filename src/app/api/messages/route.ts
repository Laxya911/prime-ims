import { NextResponse, NextRequest } from "next/server";
import Message from "@/models/messageModel";
import connectDB from "@/utils/dbConnect";

export const GET = async (request:NextRequest) => {
  try {
    await connectDB();

    const messages = await Message.find();
    // console.log(messages)
    return new NextResponse(JSON.stringify(messages), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request:NextRequest) => {
  const {
    origin,
    destination,
    weight,
    dimensions,
    name,
    phone,
    email,
    message,
  } = await request.json();

  await connectDB();
  const newQuotation = new Message({
    origin,
    destination,
    weight,
    dimensions,
    name,
    phone,
    email,
    message,
  });
  console.log(newQuotation);
  try {
    newQuotation.save();
    return new NextResponse("Quotation Added", {
      status: 201,
    });
  } catch (err) {
    const error = err as Error
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
