import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Invoice from "@/models/InvoiceModel";
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
      const client = await Invoice.findById(id);
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

      await Invoice.findByIdAndDelete(id);

      return new NextResponse("Invoice has been deleted", { status: 200 });
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
      products,
      igst,
      cgst,
      sgst,
      currency,
      subTotal,
      totalInWords,
      grandTotal,
      paymentStatus,
      created_by,
    } = await request.json();

    console.log(id);

    await connectDB();

    try {
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        {
          products,
          igst,
          cgst,
          sgst,
          currency,
          subTotal,
          totalInWords,
          grandTotal,
          paymentStatus,
          created_by,
        },
        { new: true }
      );
      console.log(updatedInvoice);
      if (!updatedInvoice) {
        return new NextResponse("Invoice not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Invoice has been updated", {
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
