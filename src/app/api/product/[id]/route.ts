import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/dbConnect";
import Product from "@/models/productModel";
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
      const client = await Product.findById(id);
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

      await Product.findByIdAndDelete(id);

      return new NextResponse("Product has been deleted", { status: 200 });
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
  }
  try {
    const { id } = params;
    const isMultipleUpdate = id.includes(",");
    const isProductUpdate = request.headers.get("X-Product-Update") === "true";

    if (isProductUpdate) {
      // Handle product details update
      const productData = await request.json();
      await connectDB();

      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });

      if (!updatedProduct) {
        return new NextResponse("Product not found", {
          status: 404, // Not Found
        });
      }

      return new NextResponse("Product has been updated", {
        status: 200, // OK
      });
    } else if (isMultipleUpdate) {
      // Handle multiple product updates
      const productIds = id.split(",");
      const { productUpdates } = await request.json();
      await connectDB();

      for (const productId of productIds) {
        const productUpdate = productUpdates.find(
          (product: { productId: any }) => product.productId === productId
        );

        if (!productUpdate) {
          return new NextResponse(
            `Product update not found for ID: ${productId}`,
            {
              status: 404, // Not Found
            }
          );
        }
        // Check if recvQty or newOrder field contains a value
        const fieldName: "recvQty" | "newOrder" | null =
          productUpdate.recvQty || productUpdate.newOrder
            ? productUpdate.recvQty
              ? "recvQty"
              : "newOrder"
            : null;

        if (fieldName === null) {
          console.warn(`No 'recvQty' or 'newOrder' value for ID: ${productId}`);
        }
        const { ...otherFields } = productUpdate;

        const updateQuery: Record<string, any> = {};

        if (fieldName === "recvQty") {
          updateQuery.$inc = { inStock: parseInt(productUpdate.recvQty, 10) };
        } else if (fieldName === "newOrder") {
          updateQuery.$inc = { inStock: -parseInt(productUpdate.newOrder, 10) };
        }
        // Use $set for other fields
        updateQuery.$set = {
          ...otherFields,
        };
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          updateQuery,
          { new: true }
        );

        console.log(updatedProduct);

        if (!updatedProduct) {
          return new NextResponse("Product not found", {
            status: 404, // Not Found
          });
        }
      }

      return new NextResponse("Products have been updated", {
        status: 200, // OK
      });
    } else {
      // Handle single product update
      const { recvQty, newOrder, ...otherFields } = await request.json();
      await connectDB();

      // Check if recvQty or newOrder field contains a value
      const fieldName: "recvQty" | "newOrder" | null =
        recvQty || newOrder ? (recvQty ? "recvQty" : "newOrder") : null;

      if (fieldName === null) {
        console.warn(`No 'recvQty' or 'newOrder' value`);
      }

      const updateQuery: Record<string, any> = {};

      if (fieldName === "recvQty") {
        updateQuery.$inc = { inStock: parseInt(recvQty, 10) };
      } else if (fieldName === "newOrder") {
        updateQuery.$inc = { inStock: -parseInt(newOrder, 10) };
      }
      // Use $set for other fields
      updateQuery.$set = {
        ...otherFields,
      };
      const updatedProduct = await Product.findByIdAndUpdate(id, updateQuery, {
        new: true,
      });

      console.log(updatedProduct);

      if (!updatedProduct) {
        return new NextResponse("Product not found", {
          status: 404, // Not Found
        });
      }
      return new NextResponse("Product has been updated", {
        status: 200, // OK
      });
    }
  } catch (err) {
    const error = err as Error;
    return new NextResponse(error.message, {
      status: 500, // Internal Server Error
    });
  }
};
