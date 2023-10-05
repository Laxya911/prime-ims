import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/dbConnect";
import PrimeInvoice from "@/models/InvoiceModel";
import { options } from "../auth/[...nextauth]/options";
export const GET = async () => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    try {
      await connectDB();
      const invoices = await PrimeInvoice.find();
      return new NextResponse(JSON.stringify(invoices), { status: 200 });
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
      invoiceNumber,
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
    const newQuote = new PrimeInvoice({
      invoiceNumber,
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
      const savedInvoice = await newQuote.save();
      const fetchInvoice = await PrimeInvoice.findById(savedInvoice._id);
      return new NextResponse(JSON.stringify(fetchInvoice), {
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
