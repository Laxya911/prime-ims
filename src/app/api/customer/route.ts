import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Customer from "@/models/customerModel";
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
      let customers;
      if (role === "superadmin") {
        customers = await Customer.find();
      } else {
        customers = await Customer.find({ companyId });
      }
      return new NextResponse(JSON.stringify(customers), { status: 200 });
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

    const newCustomer = new Customer({
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
    });
    // console.log(newCustomer);
    try {
      await newCustomer.save();
      return new NextResponse("Customer has been Added", {
        status: 201,
      });
    } catch (err) {
      const error = err as Error;
      return new NextResponse(error.message || "Database Error", {
        status: 500,
      });
    }
  }
};
