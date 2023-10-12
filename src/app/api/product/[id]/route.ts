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

        // Check if recvQty, newRecvQty, newOrder, or anotherOrder field contains a value
        const fieldName: "recvQty" | "newRecvQty" | "newOrder" | "anotherOrder" | null =
          productUpdate.recvQty || productUpdate.newRecvQty || productUpdate.newOrder || productUpdate.anotherOrder
            ? productUpdate.recvQty
              ? "recvQty"
              : productUpdate.newRecvQty
                ? "newRecvQty"
                : productUpdate.newOrder
                  ? "newOrder"
                  : "anotherOrder"
            : null;

        if (fieldName === null) {
          console.warn(`No valid quantity field for ID: ${productId}`);
        }

        const { ...otherFields } = productUpdate;

        const updateQuery: Record<string, any> = {};

        if (fieldName === "recvQty" || fieldName === "newRecvQty") {
          updateQuery.$inc = { inStock: parseInt(productUpdate.recvQty || productUpdate.newRecvQty, 10) };
        } else if (fieldName === "newOrder" || fieldName === "anotherOrder") {
          updateQuery.$inc = { inStock: -parseInt(productUpdate.newOrder || productUpdate.anotherOrder, 10) };
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
      const { recvQty, newRecvQty, newOrder, anotherOrder, ...otherFields } = await request.json();
      await connectDB();

      // Check if any of the quantity fields contain a value
      const fieldName: "recvQty" | "newRecvQty" | "newOrder" | "anotherOrder" | null =
        recvQty || newRecvQty || newOrder || anotherOrder
          ? recvQty
            ? "recvQty"
            : newRecvQty
              ? "newRecvQty"
              : newOrder
                ? "newOrder"
                : "anotherOrder"
          : null;

      if (fieldName === null) {
        console.warn(`No valid quantity field`);
      }

      const updateQuery: Record<string, any> = {};

      if (fieldName === "recvQty" || fieldName === "newRecvQty") {
        updateQuery.$inc = { inStock: parseInt(recvQty || newRecvQty, 10) };
      } else if (fieldName === "newOrder" || fieldName === "anotherOrder") {
        updateQuery.$inc = { inStock: -parseInt(newOrder || anotherOrder, 10) };
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
