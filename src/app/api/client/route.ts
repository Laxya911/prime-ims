import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Client from "@/models/clientModel";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
export const GET = async () => {

  const session = await getServerSession(options);
  if (!session || !session.user) {
     // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
    
  } else {

  // console.log(session.user.name);

  try {
    await connectDB();

    const Clients = await Client.find();
    // console.log(Clients)
    return new NextResponse(JSON.stringify(Clients), { status: 200 });
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
  const {
    name,
    gst_vat_no,
    contact_no,
    email,
    company,
    address,
    country,
    state,
    city,
    zip,
    type,
    companyId,
    date_created,
    created_by,
  } = await request.json();

  await connectDB();

  const newClient = new Client({
    name,
    gst_vat_no,
    contact_no,
    email,
    company,
    address,
    country,
    state,
    city,
    zip,
    type,
    companyId,
    date_created,
    created_by,
  });
  // console.log(newClient);
  try {
    await newClient.save();
    return new NextResponse("newClient has been Added", {
      status: 201,
    });
  } catch (err) {
    const error = err as Error;
    return new NextResponse(error.message || "Database Error", {
      status: 500,
    });
  }}
};
