import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/utils/dbConnect";
import Product from "@/models/productModel";
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
      let products;
      if (role === "superadmin") {
        products = await Product.find();
      } else {
        products = await Product.find({ companyId });
      }
      // const products = await Product.find();
      return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }
};

export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    // Not Signed in
    return new NextResponse("unauthorized", { status: 401 });
  } else {
    const {
      productName,
      category,
      inStock,
      buyingPrice,
      productCode,
      sellingPrice,
      brand,
      unit,
      gst,
      total,
      companyId,
      created_by,
    } = await request.json();
    await connectDB();

    const productCodeExist =await Product.findOne({productCode});

    if (productCodeExist) {
      return new NextResponse("Product with the given Code already exists", {
        status: 409, 
      });
    }
    
    const updateProduct = new Product({
      productName,
      category,
      productCode,
      sellingPrice,
      brand,
      gst,
      unit,
      inStock,
      total,
      buyingPrice,
      companyId,
      created_by,
    });

    try {
      const savedProduct = await updateProduct.save();
      const fetchProduct = await Product.findById(savedProduct._id);
      return new NextResponse(JSON.stringify(fetchProduct), {
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
