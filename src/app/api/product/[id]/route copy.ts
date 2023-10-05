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
  } else {
    const { id } = params;
    const isMultipleUpdate = id.includes(",");
    
    try {
      if (isMultipleUpdate) {
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
          const {
            productCode,
            productName,
            category,
            buyingPrice,
            addedOn,
            companyId,
            created_by,
          } = productUpdate;
          
          const inStockValue = parseInt(productUpdate.inStock, 10);

          if (isNaN(inStockValue)) {
            // Handle the case where inStock is not a valid number
            return new NextResponse(
              `Invalid 'inStock' value for ID: ${productId}`,
              {
                status: 400, // Bad Request
              }
            );
          }
  
          const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
              productCode,
              productName,
              category,
              $inc: { inStock: inStockValue },
              buyingPrice,
              addedOn,
              companyId,
              created_by,
            },
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
        const {
          productCode,
          productName,
          category,
          buyingPrice,
          addedOn,
          companyId,
          created_by,
          inStock,
        } = await request.json();

        const inStockValue = parseInt(inStock, 10);

        if (isNaN(inStockValue)) {
          // Handle the case where inStock is not a valid number
          return new NextResponse(
            "Invalid 'inStock' value",
            {
              status: 400, // Bad Request
            }
          );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            productCode,
            productName,
            category,
            buyingPrice,
            $inc: { inStock: inStockValue },
            addedOn,
            companyId,
            created_by,
          },
          { new: true }
        );

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
  }
};
