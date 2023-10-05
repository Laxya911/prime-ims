import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Vendor from "@/models/vendorModel";
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
      const client = await Vendor.findById(id);
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
        await Vendor.findByIdAndDelete(id);
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
      vName,
      gst_vat_no,
      contact_no,
      email,
      company,
      address,
      country,
      state,
      city,
      zip,
      companyId,
      date_created,
      created_by,
    } = await request.json();

    await connectDB();

    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
        _id,
        {
          vName,
          gst_vat_no,
          contact_no,
          email,
          company,
          address,
          country,
          state,
          city,
          zip,
          companyId,
          date_created,
          created_by,
        },
        { new: true }
      );
      console.log(updatedVendor);
      if (!updatedVendor) {
        return new NextResponse("Vendor not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Vendor has been updated", {
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
