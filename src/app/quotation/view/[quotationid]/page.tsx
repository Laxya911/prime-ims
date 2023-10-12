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
    quotationid: string;
  };
}

const UpdatePurchase: React.FC<UpdateProps> = ({ params: { quotationid } }) => {
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
    // Fetch purchase data based on quotationid
    const fetchPurchaseData = async () => {
      try {
        const response = await axios.get(`/api/quotation/${quotationid}`);
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

    if (quotationid) {
      fetchPurchaseData();
    }
  }, [quotationid]);

  const handleProductChange = (
    index: number,
    field: keyof PurchaseProduct,
    value: string | number
  ) => {
    const updatedProducts = [...products];

    if (
      field === "newOrder" ||
      field === "buyingPrice" ||
      field === "gst" ||
      field === "recvQty" ||
      field === "newRecvQty" ||
      field === "newBal" ||
      field === "balQty"
    ) {
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

      const newRecvQty = parsedValue;
      // const recvQty = updatedProducts[index].recvQty || 0;
      const balQty = updatedProducts[index].balQty || 0;

      // Calculate newBal as balQty - newRecvQty
      const newBal = balQty - newRecvQty;
      updatedProducts[index].newBal = newBal;

      const newRecv = updatedProducts[index].newRecvQty;
      // const balance = updatedProducts[index].balQty;

      if (newBal === 0 || newRecv === balQty) {
        updatedProducts[index].status = "Sent";
      } else if (newRecv > 0 || newBal < balQty) {
        updatedProducts[index].status = "Partial";
      } else {
        updatedProducts[index].status = "Pending";
      }
    } else {
      (updatedProducts[index] as any)[field] = value;
    }

    setProducts(updatedProducts);
    setIsDirty(true)
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
        `/api/quotation/${quotationid}`,
        updatedData
      );
      toast.success("quotation updated successfully");
    } catch (error) {
      console.error("Error updating Quotation:", error);
      toast.error("Error updating Quotation");
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (!products || !quotationid) {
    return (
      <>
        <NotFound />
      </>
    );
  }
  if (session) {
    return (
      <>
        <Breadcrumb pageName="Update Quotation" />
        {/* Rest of your form */}
        {purchaseData && (
          <>
            <form onSubmit={handleSubmit} className="px-4 py-2 shadow-md shadow-warning">
              <div className="flex flex-col sm:flex-row justify-center text-center gap-2  lg:gap-20 mt-6 mb-4">
                <div>
                  <span className="text-lg "> Quotation Number </span>
                  <input
                    className="rounded h-6 bg-gray text-black text-center "
                    type="text"
                    name="po_Number"
                    value={purchaseData.qNumber}
                    readOnly
                  />
                </div>
                <div>
                  <span className="text-lg "> Vendor  </span>
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
                  <table className="w-full text-xs mb-4">
                    <thead className="mb-4">
                      <tr className="text-xs  ">
                        <th className="px-2 py-1 ">iName</th>
                        <th className="px-2 py-1 ">iCode</th>
                        <th className="px-2 py-1 ">Order</th>
                        <th className="px-2 py-1 ">Sent</th>
                        <th className="px-2 py-1 ">Balance</th>
                        <th className="px-2 py-1 ">Resend</th>
                        <th className="px-2 py-1 ">New bal.</th>
                        <th className="px-2 py-1 ">Rate</th>
                        <th className="px-2 py-1 ">Total</th>
                        <th className="px-2 py-1 ">Status</th>
                        <th className="px-2 py-1 ">GST</th>
                        <th className="px-2 py-1 ">Remarks</th>
                        <th className="px-2 py-1 "></th>
                      </tr>
                    </thead>
                    {purchaseData.products.length > 0 && (
                      <tbody>
                        {purchaseData.products.map((product, index) => (
                          <tr key={index} className="mb-4 py-2">
                            <td >
                              <input
                                type="text"
                                value={product.productName ?? ""}
                                className="px-2 py-1 w-30 rounded"
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="px-2 py-1 w-30 rounded"
                                value={product.productCode ?? ""}
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
                                value={
                                  isNaN(product.newOrder) ? 0 : product.newOrder
                                }
                                required={true}
                                readOnly={true}
                                min={1}
                              />
                            </td>

                            <td>
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
                                value={
                                  isNaN(product.recvQty) ? 0 : product.recvQty
                                }
                                readOnly={true}
                                min={0}
                                max={product.newOrder}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "recvQty",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
                                value={
                                  isNaN(product.balQty) ? "0" : product.balQty
                                }
                                min={0}
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
                                min={0}
                                max={product.balQty}
                                value={product.newRecvQty ?? 0}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "newRecvQty",
                                    e.target.value
                                  )
                                }
                                readOnly={product.newOrder === product.recvQty}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
                                readOnly={true}
                                value={
                                  isNaN(product.newBal) ? 0 : product.newBal
                                }
                                min={0}
                                max={product.newOrder}
                                onChange={(e) =>
                                  handleProductChange(
                                    index,
                                    "newBal",
                                    e.target.value
                                  )
                                }
                              />
                            </td>

                            <td className="px-2">
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
                                value={product.buyingPrice ?? 0}
                                readOnly={true}
                              />
                            </td>
                            <td className="px-2">
                              <input
                                type="number"
                                className="px-2 py-1 w-20 rounded"
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
                                className="px-2 py-1 w-25 rounded"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Partial">
                                  Partial Sent
                                </option>
                                <option value="Sent">Sent</option>
                              </select>
                            </td>

                            <td className="px-2">
                              <input
                                type="number"
                                className="px-2 py-1 w-15 rounded"
                                min="0"
                                value={product.gst ?? 0}
                                readOnly={true}
                              />
                            </td>
                            <td className="px-2">
                              <input
                                type="text"
                                className="px-2 py-1 w-40 rounded"
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
                  <Link href="/purchase/view"> Check PO</Link>
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
