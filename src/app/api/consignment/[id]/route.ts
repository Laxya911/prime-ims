import { NextResponse, NextRequest } from "next/server";
import Consignment from "@/models/consignmentModel";
import connectDB from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
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
      courier_partner,
      shipment_type,
      payment_mode,
      packages,
      subTotal,
      actualWeight,
      totalDim,
      origin,
      destination,
      trackingUrl,
      comments,
      shipment_status,
      created_by,
    } = await request.json();
    console.log(id);
    await connectDB();
    try {
      const updatedConsignment = await Consignment.findByIdAndUpdate(
        id,
        {
          courier_partner,
          shipment_type,
          payment_mode,
          packages,
          subTotal,
          actualWeight,
          totalDim,
          origin,
          destination,
          trackingUrl,
          comments,
          shipment_status,
          created_by,
        },
        { new: true }
      );
      console.log(updatedConsignment);
      if (!updatedConsignment) {
        return new NextResponse("Consignment not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Consignment has been updated", {
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

      // const consignment = await Consignment.findById(id);

      const consignment = await Consignment.findOne({
        $or: [{ _id: id }, { tracking_id: id }],
      });

      if (!consignment) {
        return new NextResponse("Consignment not found", { status: 404 });
      }

      return new NextResponse(JSON.stringify(consignment), { status: 200 });
    } catch (err) {
      console.error(err);
      return new NextResponse("Database Error", { status: 500 });
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

      await Consignment.findByIdAndDelete(id);

      return new NextResponse("Consignment has been deleted", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};
