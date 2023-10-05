import { NextResponse, NextRequest } from "next/server";
import connecDB from "@/utils/dbConnect";
import Log from "@/models/log";

export const GET = async (request: NextRequest) => {
  try {
    await connecDB();
    const logs = await Log.find();
    return new NextResponse(JSON.stringify(logs), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const {
    deletedBy,
    deletedItem,
    itemType,
    userName,
    deletedName,
    deletedEmail,
  
  } = await request.json();

  await connecDB();

  const newLogs = new Log({
    deletedBy,
    deletedItem,
    itemType,
    userName,
    deletedName,
    deletedEmail,
  });
//   console.log(newLogs);
  try {
    await newLogs.save();
    return new NextResponse("ActivityLog has been Added", {
      status: 201,
    });
  } catch (err) {
    const error = err as Error
    return new NextResponse(error.message, {
      status: 500,
    });
  }
};
