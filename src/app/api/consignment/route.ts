import { NextResponse , NextRequest} from "next/server";
import { v4 as uuidv4 } from "uuid"
import Consignment from "@/models/consignmentModel";
import connectDB from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
  const {
    companyId,
    sender,
    senderEmail,
    senderName,
    senderContact,
    senderGst,
    senderAddress,
    senderZip,
    senderCity,
    senderState,
    senderCountry,
    receiver,
    receiverEmail,
    receiverName,
    receiverContact,
    receiverGst,
    receiverAddress,
    receiverZip,
    receiverCity,
    receiverState,
    receiverCountry,
    packages,
    subTotal,
    actualWeight,
    totalDim,
    origin,
    destination,
    courier_partner,
    trackingUrl,
    shipment_type,
    payment_mode,
    shipment_status,
    comments,
    created_by,
  } = await request.json();

  await connectDB();

  try {
    const consignment = new Consignment({
      companyId,
      sender,
      senderEmail,
      senderName,
      senderContact,
      senderGst,
      senderAddress,
      senderZip,
      senderCity,
      senderState,
      senderCountry,
      receiver,
      receiverEmail,
      receiverName,
      receiverContact,
      receiverGst,
      receiverAddress,
      receiverZip,
      receiverCity,
      receiverState,
      receiverCountry,
      packages,
      subTotal,
      actualWeight,
      totalDim,
      origin,
      destination,
      courier_partner,
      trackingUrl,
      shipment_type,
      payment_mode,
      shipment_status,
      comments,
      created_by,
    });
    console.log(consignment);

    // Generate and set ID for the consignment
    const _id = uuidv4().replace(/-/g, "").substring(0, 10).toUpperCase();
    // Make sure the UUID has exactly 16 characters
    if (_id.length !== 10) {
      console.error("Error: ID is not 10 characters long");
      return;
    }
    // Make sure the UUID contains only alphanumeric characters
    const reg = /^[0-9a-zA-Z]+$/;
    if (!reg.test(_id)) {
      console.error("Error: ID contains non-alphanumeric characters");
      return;
    }
    // Set ID for the consignment
    consignment._id = _id;

    // Generate and set tracking ID for the consignment
    const trackingId = uuidv4()
      .replace(/-/g, "")
      .substring(0, 10)
      .toUpperCase();
    // Make sure the UUID has exactly 16 characters
    if (trackingId.length !== 10) {
      console.error("Error: Tracking ID is not 10 characters long");
      return;
    }
    // Make sure the UUID contains only alphanumeric characters
    const regex = /^[0-9a-zA-Z]+$/;
    if (!regex.test(trackingId)) {
      console.error("Error: Tracking ID contains non-alphanumeric characters");
      return;
    }
    // Set tracking ID for the consignment
    consignment.tracking_id = trackingId;

    await consignment.save();
    const packageData = consignment;
    // console.log(packageData)

    return  NextResponse.json(packageData, {
      status: 201,
    });
  } catch (err){
    const error = err as Error;
    return  NextResponse.json(error.message || "Database Error", {
      status: 500,
    });
  }}
};

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
  try {
    await connectDB();
    const consignments = await Consignment.find();
    // console.log(consignments)
    return new NextResponse(JSON.stringify(consignments), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }}
};
