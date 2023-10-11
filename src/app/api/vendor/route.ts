import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Vendor from "@/models/vendorModel";
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
      let vendors;
      if (role === "superadmin") {
        vendors = await Vendor.find();
      } else {
        vendors = await Vendor.find({ companyId });
      }
      // console.log(Vendors)
      return new NextResponse(JSON.stringify(vendors), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    return new NextResponse("unauthorized", { status: 401 });
  } else {

    
    const {
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

    const existingVendor = await Vendor.findOne({ gst_vat_no });

    if (existingVendor) {
      return new NextResponse("Vendor with the given GST already exists", {
        status: 409, 
      });
    }

    const newVendor = new Vendor({
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
    });
    console.log(newVendor);
    try {
      await newVendor.save();
      return new NextResponse("Vendor has been Added", {
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
