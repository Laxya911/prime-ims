
import { NextResponse, NextRequest } from "next/server";
import Message from "@/models/messageModel";
import connectDB from "@/utils/dbConnect";

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
  
    try {
      await connectDB();
  
      await Message.findByIdAndDelete(id);
  
      return new NextResponse("Message has been deleted", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  };
  