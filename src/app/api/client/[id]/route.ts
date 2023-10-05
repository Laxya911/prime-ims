import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Client from "@/models/clientModel";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(options);
  if (!session) {
     // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
    
  } else {
    console.log("Session", JSON.stringify(session, null, 2));
    const { id } = params;
    try {
      await connectDB();
      const client = await Client.findById(id);
      return NextResponse.json(client, { status: 200 });
    } catch (err) {
      return NextResponse.json("Database Error", { status: 500 });
    }
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await connectDB();
    const deletedClient = await Client.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Client has been deleted",
        deletedId: id,
        deletedClient: deletedClient.toObject(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting client:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const {
    _id,
    name,
    gst_vat_no,
    email,
    contact_no,
    company,
    address,
    country,
    state,
    city,
    zip,
    type,
    date_created,
    updated_at,
    created_by,
  } = await request.json();

  await connectDB();

  try {
    const updatedClient = await Client.findByIdAndUpdate(
      _id,
      {
        name,
        gst_vat_no,
        email,
        contact_no,
        company,
        address,
        country,
        state,
        city,
        zip,
        type,
        date_created,
        updated_at,
        created_by,
      },
      { new: true }
    );
    console.log(updatedClient);
    if (!updatedClient) {
      return new NextResponse("Client not found", {
        status: 404, // Not Found
      });
    }

    return new NextResponse("Client has been updated", {
      status: 200, // OK
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(error.message || "Database Error", {
      status: 500,
    });
  }
};
