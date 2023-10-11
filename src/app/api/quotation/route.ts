import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Quotation from "@/models/quotationModel";
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
      let quotations;
      if (role === "superadmin") {
        quotations = await Quotation.find();
      } else {
        quotations = await Quotation.find({ companyId });
      }
      // const quotations = await Quotation.find();
      return new NextResponse(JSON.stringify(quotations), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  // console.log(session)
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const {
      qNumber,
      products,
      customerName,
      contact_no,
      email,
      address,
      gst_vat_no,
      customerId,
      subTotal,
      totalGst,
      grandTotal,
      companyId,
      created_by,
      date_created,
    } = await request.json();

    await connectDB();
    const newQuote = new Quotation({
      qNumber,
      products,
      customerName,
      customerId,
      contact_no,
      email,
      address,
      gst_vat_no,
      subTotal,
      totalGst,
      grandTotal,
      companyId,
      created_by,
      date_created,
    });

    try {
      const savedQuote = await newQuote.save();
      const fetchedQuote = await Quotation.findById(savedQuote._id);
      return new NextResponse(JSON.stringify(fetchedQuote), {
        status: 201,
      });
    } catch (err) {
      const error = err as Error;
      return new NextResponse(error.message, {
        status: 500,
      });
    }
  }
};
