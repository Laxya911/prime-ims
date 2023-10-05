import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Purchase from "@/models/purchaseModel";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export const GET = async () => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    try {
      await connectDB();
      const invoices = await Purchase.find();
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
      po_Number,
      products,
      vName,
      contact_no,
      email,
      address,
      gst_vat_no,
      vendorID,
      subTotal,
      totalGst,
      grandTotal,
      companyId,
      created_by,
      date_created,
    } = await request.json();

    await connectDB();
    const newPurchase = new Purchase({
      po_Number,
      products,
      vName,
      vendorID,
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
      const savedInvoice = await newPurchase.save();
      const fetchedInvoice = await Purchase.findById(savedInvoice._id);
      return new NextResponse(JSON.stringify(fetchedInvoice), {
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
// export const POST = async (request: NextRequest) => {
//   const session = await getServerSession(options);
//   if (!session || !session.user) {
//     // Not Signed in
//     return new NextResponse("unauthorized", { status: 401 });
//   } else {
//     try {
//       await connectDB();

//       // Find the document with the highest po_Number for the current company
//       const latestPurchase = await Purchase.findOne(
//         { companyId: session.user.companyId },
//         {},
//         { sort: { po_Number: -1 } }
//       );

//       let nextPoNumber = 1;
//       if (latestPurchase) {
//         const parts = latestPurchase.po_Number.split("-");
//         nextPoNumber = parseInt(parts[2], 10) + 1;
//       }

//       const {
//         products,
//         vName,
//         vendorID,
//         subTotal,
//         companyId,
//         created_by,
//         date_created,
//       } = await request.json();

//       // Generate the new po_Number
//       const newPoNumber = `${companyId}-${nextPoNumber}`;

//       // Create and save the new purchase order with the generated po_Number
//       const newPurchase = new Purchase({
//         po_Number: newPoNumber,
//         products,
//         vName,
//         vendorID,
//         subTotal,
//         companyId,
//         created_by,
//         date_created,
//       });

//       const savedPurchase = await newPurchase.save();
//       return new NextResponse(JSON.stringify(savedPurchase), {
//         status: 201,
//       });
//     } catch (err) {
//       const error = err as Error;
//       return new NextResponse(error.message, {
//         status: 500,
//       });
//     }
//   }
// };
// export const POST = async (request: NextRequest) => {
//   const session = await getServerSession(options);
//   if (!session || !session.user) {
//     // Not Signed in
//     return new NextResponse("unauthorized", { status: 401 });
//   } else {
//     try {
//       await connectDB();
//       const {
//         po_Number,
//         products,
//         vName,
//         vendorID,
//         subTotal,
//         companyId,
//         created_by,
//         date_created,
//       } = await request.json();

//       const newPurchase = new Purchase({
//         po_Number,
//         products,
//         vName,
//         vendorID,
//         subTotal,
//         companyId,
//         created_by,
//         date_created,
//       });

//       await newPurchase.save();

//       return new NextResponse(JSON.stringify(newPurchase), {
//         status: 201,
//       });
//     } catch (err) {
//       const error = err as Error;
//       if (error) {
//         // Duplicate key error (duplicate po_Number)
//         return new NextResponse("Duplicate po_Number", { status: 400 });
//       }
//       return new NextResponse(error, {
//         status: 500,
//       });
//     }
//   }
// };
