"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseProduct } from "@/app/types/product";
import Link from "next/link";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import AuthUsers from "@/utils/auth";

interface UpdateProps {
  params: {
    invoiceId: string;
  };
}

const UpdatePurchase: React.FC<UpdateProps> = ({ params: { invoiceId } }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const { session } = AuthUsers();

  // Define state variables for the purchase data and calculated values
  const [purchaseData, setPurchaseData] = useState<PurchaseProduct | null>(
    null
  );
  const [subTotal, setSubTotal] = useState<number>(0);
  const [gstValue, setGstValue] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch purchase data based on invoiceId
    const fetchPurchaseData = async () => {
      try {
        const response = await axios.get(`/api/primeinvoice/${invoiceId}`);
        const data = response.data;

        if (Array.isArray(data.products)) {
          // Set the purchase data
          setProducts(data.products);
          setLoading(false);
        } else {
          console.error("Invalid products data:", data.products);
          setLoading(false);
        }
        setPurchaseData(data);
        setLoading(false);
        // Calculate and set subTotal, gstValue, and grandTotal based on the fetched data
        let calculatedSubTotal = 0;
        let calculatedGstValue = 0;
        data.products.forEach((product: PurchaseProduct) => {
          calculatedSubTotal += product.total;
          calculatedGstValue += (product.total * product.gst) / 100;
        });
        setSubTotal(calculatedSubTotal);
        setGstValue(calculatedGstValue);
        setGrandTotal(calculatedSubTotal + calculatedGstValue);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };
    if (invoiceId) {
      fetchPurchaseData();
    }
  }, [invoiceId]);

  const handleProductChange = (
    index: number,
    field: keyof PurchaseProduct,
    value: string | number
  ) => {
    const updatedProducts = [...products];

    if (field === "newOrder" || field === "sellingPrice" || field === "gst") {
      let parsedValue = 0; // Initialize with a default value
      // Check if the value is a valid number representation
      if (typeof value === "string" && !isNaN(parseFloat(value))) {
        parsedValue = parseFloat(value);
      }
      const productId = products[index]._id;
      // Update the selectedProductIds array based on the interaction
      setSelectedProductIds((prevIds) => {
        if (!prevIds.includes(productId)) {
          return [...prevIds, productId];
        }
        return prevIds;
      });
      updatedProducts[index][field] = parsedValue;
    } else {
      (updatedProducts[index] as any)[field] = value;
    }

    setProducts(updatedProducts);
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the data to send to the API
      const updatedData = {
        ...purchaseData,
        products: products,
      };
      const response = await axios.put(
        `/api/primeinvoice/${invoiceId}`,
        updatedData
      );
      toast.success("Invoice updated successfully");
      // if (selectedProductIds.length === 1) {
      //   // Handle a single ID
      //   const productId = selectedProductIds[0];
      //   const product = products.find((product) => product._id === productId);
      //   const newRecvQty = product?.newRecvQty || 0; // Use the appropriate quantity field
      //   // Proceed with the PUT request to api/product for a single ID
      //   axios
      //     .put(`/api/product/${productId}`, { newRecvQty })
      //     .then((response) => {
      //       // Handle success of the PUT request
      //       toast.success("Product updated successfully");
      //       // Continue with the rest of your logic (clearing data, generating numbers, etc.)
      //     })
      //     .catch((error) => {
      //       toast.error("Error updating Product");
      //       // Handle error of the PUT request
      //       console.error("Error updating product", error);
      //     });
      // } else if (selectedProductIds.length > 1) {
      //   // Handle multiple IDs
      //   const productUpdates = products.map((product) => ({
      //     productId: product._id,
      //     newRecvQty: product.newRecvQty || 0, // Use the appropriate quantity field
      //   }));
      //   // Proceed with the PUT request to api/product for multiple IDs
      //   axios
      //     .put(`/api/product/${selectedProductIds.join(",")}`, {
      //       productUpdates,
      //     })
      //     .then((response) => {
      //       // Handle success of the PUT request
      //       toast.success("Products updated successfully");
      //       // Continue with the rest of your logic (clearing data, generating numbers, etc.)
      //     })
      //     .catch((error) => {
      //       toast.error("Error updating Products");
      //       // Handle error of the PUT request
      //       console.error("Error updating products", error);
      //     });
      // } else {
      //   // Handle the case where no products are selected
      //   toast.warning("No products selected for update");
      // }
    } catch (error) {
      console.error("Error updating Invoice:", error);
      toast.error("Error updating Invoice");
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (!products || !invoiceId) {
    return (
      <>
        <NotFound />
      </>
    );
  }
  if (session) {
    return (
      <>
        <Breadcrumb pageName="Update Invoice" />
        {/* Rest of your form */}
        {purchaseData && (
          <>
            <form onSubmit={handleSubmit} className="shadow-sm shadow-warning px-4 py-2">
              <div className="flex flex-col sm:flex-row justify-center text-center gap-2  lg:gap-20 mt-6 mb-4">
                <div>
                  <span className="text-lg "> Invoice Number </span>
                  <input
                    className="rounded h-6 bg-gray text-black text-center "
                    type="text"
                    name="po_Number"
                    value={purchaseData.invoiceNumber}
                    readOnly
                  />
                </div>
                <div>
                  <span className="text-lg "> Customer </span>
                  <input
                    className="rounded h-6 bg-gray text-black text-center "
                    type="text"
                    name="po_Number"
                    value={purchaseData.customerName}
                    readOnly
                  />
                </div>
              </div>

              <p className={styles.heading}> &#10146; Product Details</p>
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-center mb-4">
                    <thead className="mb-4">
                      <tr className="text-xs text-center ">
                        <th className="px-2 py-1 ">Item</th>
                        <th className="px-2 py-1 ">iCode</th>
                        <th className="px-2 py-1 ">Order Qty</th>
                        <th className="px-2 py-1 ">Rate</th>
                        <th className="px-2 py-1 ">Total</th>
                        <th className="px-2 py-1 ">Payment</th>
                        <th className="px-2 py-1 ">GST</th>
                        <th className="px-2 py-1 ">Remarks</th>
                        <th className="px-2 py-1 "></th>
                      </tr>
                    </thead>
                    {purchaseData.products.length > 0 && (
                      <tbody>
                        {purchaseData.products.map((product, index) => (
                          <tr key={index} className="mb-4 py-2">
                            <td className="px-4">
                              <input
                                type="text"
                                value={product.productName ?? ""}
                                placeholder="P. Name"
                                className="px-2 py-1 w-30 rounded text-black"
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="px-2 py-1 w-20 rounded text-black"
                                placeholder="P. code"
                                value={product.productCode ?? ""}
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded text-black"
                                value={
                                  isNaN(product.newOrder) ? 0 : product.newOrder
                                }
                                required={true}
                                readOnly={true}
                                min={1}
                              />
                            </td>

                            <td className="px-4">
                              <input
                                type="number"
                                className="px-2 py-1 w-30 rounded text-black"
                                value={product.sellingPrice ?? 0}
                                readOnly={true}
                              />
                            </td>
                            <td className="px-4">
                              <input
                                type="number"
                                className="px-2 py-1 w-30 rounded text-black"
                                value={product.total ?? 0}
                                readOnly={true}
                              />
                            </td>

                            <td>
                              <select
                                value={product.status}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "status",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 w-36 rounded text-black"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Partial">Partial Paid</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </td>

                            <td className="px-4">
                              <input
                                type="number"
                                className="px-2 py-1 w-15 rounded text-black"
                                min="0"
                                value={product.gst ?? 0}
                                readOnly={true}
                              />
                            </td>
                            <td className="px-4">
                              <input
                                type="text"
                                placeholder="Remarks"
                                className="px-2 py-1 w-30 rounded text-black"
                                value={product.remark ?? ""}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "remark",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </>

              <div className="flex flex-col sm:flex-row justify-end ">
                <div className="w-full sm:w-[250px]">
                  <div>
                    <p>Sub Total: {subTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p>Total GST: {gstValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p>Grand Total: {grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <hr className="mt-1" />
              <div className="flex py-2 px-2 mt-2 sm:px-80 gap-4 flex-col sm:flex-row">
                <button
                  onSubmit={handleSubmit}
                  className={ 
                    isDirty ? styles.saveButton : styles.disabledButton
                  }
                  disabled={!isDirty}
                >
                  Update
                </button>
                <button type="button" className={styles.cancelButton}>
                  <Link href="/"> Cancel</Link>
                </button>
                <button type="button" className={styles.editButton}>
                  <Link href="/invoice/view"> Invoices</Link>
                </button>
              </div>
            </form>
          </>
        )}
      </>
    );
  }
};

export default UpdatePurchase;
