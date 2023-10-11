// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import Company from "@/models/compModel";
import connectDB from "@/utils/dbConnect";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "superadmin") {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const {
      logo,
      name,
      companyId,
      contact,
      email,
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
    } = await request.json();

    await connectDB();

    try {
      const company = new Company({
        logo,
        name,
        companyId,
        contact,
        email,
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
      });
      // console.log(employee);
      await company.save();
      return new NextResponse("company has been added", {
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

export const GET = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    try {
      await connectDB();
      const { role, companyId } = session.user;
      let companies;
      if (role === "superadmin") {
        companies = await Company.find();
      } else {
        companies = await Company.find({ companyId });
      }
      // const company = await Company.find();
      return new NextResponse(JSON.stringify(companies), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};
