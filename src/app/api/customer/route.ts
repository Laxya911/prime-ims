import { NextResponse , NextRequest} from "next/server";
import connectDB from "@/utils/dbConnect";
import Customer from "@/models/customerModel";

export const GET = async () => {
  try {
    await connectDB();

    const customers = await Customer.find();
    // console.log(customers)
    return new NextResponse(JSON.stringify(customers), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  const {
    customerName,
    contact_no,
    email,
    address,
    country,
    state,
    city,
    zip,
    companyId,
    name,
    created_by,
  } = await request.json();

  await connectDB();

  const newCustomer = new Customer({
    customerName,
    contact_no,
    email,
    address,
    country,
    state,
    city,
    zip,
    companyId,
    name,
    created_by,
  });
  // console.log(newCustomer);
  try {
    await newCustomer.save();
    return new NextResponse("Customer has been Added", {
      status: 201,
    });
  }catch (err) {
    const error = err as Error;
    return new NextResponse(error.message || "Database Error", {
      status: 500,
    });
  }
};
