import { NextResponse, NextRequest } from "next/server";
import Company from "@/models/compModel";
import connectDB from "@/utils/dbConnect";
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

      const comapny = await Company.findById(id);

      return new NextResponse(JSON.stringify(comapny), { status: 200 });
    } catch (err) {
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

      await Company.findByIdAndDelete(id);

      return new NextResponse("Company has been deleted", { status: 200 });
    } catch (err) {
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
      logo,
      name,
      contact,
      email,
      company_Url,
      companyId,
      doj,
      pancard,
      gstNo,
      address,
      country,
      state,
      city,
      zip,
      bank_name,
      account_no,
      account_type,
      ifsc_code,
      b_branch,
      b_address,
      created_by,
    } = await request.json();

    await connectDB();

    try {
      const updatedComapny = await Company.findByIdAndUpdate(
        _id,
        {
          logo,
          name,
          contact,
          email,
          companyId,
          company_Url,
          doj,
          pancard,
          gstNo,
          address,
          country,
          state,
          city,
          zip,
          bank_name,
          account_no,
          account_type,
          ifsc_code,
          b_branch,
          b_address,
          created_by,
        },
        { new: true }
      );
      console.log(updatedComapny);
      if (!updatedComapny) {
        return new NextResponse("Company not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Company has been updated", {
        status: 201, // OK
      });
    } catch (err) {
      const error = err as Error;
      return new NextResponse(error.message, {
        status: 500, // Internal Server Error
      });
    }
  }
};
