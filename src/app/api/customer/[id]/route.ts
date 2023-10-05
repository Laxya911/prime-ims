import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Customer from "@/models/customerModel";
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
      const client = await Customer.findById(id);
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
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const { id } = params;
    try {
      await connectDB();
      try {
        await connectDB();
        await Customer.findByIdAndDelete(id);
        return new NextResponse("User has been deleted", { status: 200 });
      } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
      }
    } catch (err) {
      console.error("Error deleting client:", err);
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
      customerName,
      contact_no,
      email,
      address,
      country,
      state,
      city,
      zip,
      companyId,
      name,
      created_by,
    } = await request.json();

    await connectDB();

    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(
        _id,
        {
          customerName,
          contact_no,
          email,
          address,
          country,
          state,
          city,
          zip,
          companyId,
          name,
          created_by,
        },
        { new: true }
      );
      console.log(updatedCustomer);
      if (!updatedCustomer) {
        return new NextResponse("Customer not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Customer has been updated", {
        status: 200, // OK
      });
    } catch (err) {
      const error = err as Error;
      return NextResponse.json(error.message || "Database Error", {
        status: 500,
      });
    }
  }
};
