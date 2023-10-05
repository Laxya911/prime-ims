import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Quotation from "@/models/quotationModel";
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
      const client = await Quotation.findById(id);
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

      await Quotation.findByIdAndDelete(id);

      return new NextResponse("Quotation has been deleted", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const { id } = params;

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

    console.log(id);

    await connectDB();

    try {
      const updatedInvoice = await Quotation.findByIdAndUpdate(
        id,
        {
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
        },
        { new: true }
      );
      console.log(updatedInvoice);
      if (!updatedInvoice) {
        return new NextResponse("Quotation not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Quotation has been updated", {
        status: 200, // OK
      });
    } catch (err) {
      const error = err as Error;
      return new NextResponse(error.message, {
        status: 500, // Internal Server Error
      });
    }
  }
};
