"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "../common.module.css";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseProduct } from "../types/product";
import ProductApi from "../commonApi/productApi";
import VendorApi from "../commonApi/vendorApi";

type ProductField = keyof PurchaseProduct;

const Purchase = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);

  const {allProducts, updateProducts} = ProductApi();

  const [vendor, setVendor] = useState({
    vName: "",
    contact_no: "",
    email: "",
    address: "",
    gst_vat_no: "",
  });

  const {allVendors} = VendorApi();

  const [selectedVendorId, setSelectedVendorId] = useState("");
  const handleVendorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedVendorId(selectedId);
    // Find the selected vendor's data and populate the input fields
    const selectedVendor = allVendors.find(
      (vendor) => vendor._id === selectedId
    );
    if (selectedVendor) {
      setVendor(selectedVendor);
    }
    setProducts([]);
    setSelectedProductId(null);
    setSelectedProductIds([]);
  };

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isProductSelected, setIsProductSelected] = useState(false);

  const handleProductSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = e.target.value;
    if (selectedProductIds.includes(selectedId)) {
      toast.error("Product already selected.");
      return;
    }
    const selectedProduct = allProducts.find(
      (product) => product._id === selectedId
    );
    try {
      // Make an API call to fetch the purchase data for the selected vendor
      const purchaseResponse = await axios.get(
        `/api/purchase?vendorID=${selectedVendorId}`
      );
      let minimumBuyingPrice = Number.MAX_SAFE_INTEGER; // Initialize with a large value
      let matchingProduct: PurchaseProduct | undefined = undefined;

      for (const purchase of purchaseResponse.data) {
        // Filter products that belong to the selected vendor
        const selectedVendorProducts = purchase.products.filter(
          (product: { vendorID: string; vName: string }) =>
            product.vendorID === selectedVendorId ||
            product.vName === vendor.vName
        );

        for (const product of selectedVendorProducts) {
          if (
            product._id === selectedId &&
            product.buyingPrice < minimumBuyingPrice
          ) {
            minimumBuyingPrice = product.buyingPrice;
            matchingProduct = product;
          }
        }
      }

      let newProduct: PurchaseProduct;

      if (matchingProduct) {
        console.log(matchingProduct);
        newProduct = {
          ...selectedProduct!,
          newOrder: 0,
          recvQty: 0,
          balQty: 0,
          buyingPrice: minimumBuyingPrice,
          date_created: new Date(),
          vName: vendor.vName,
          contact_no: vendor.contact_no,
          email: vendor.email,
          address: vendor.address,
          gst_vat_no: vendor.gst_vat_no,
          po_Number: po_number,
          total: (selectedProduct?.newOrder || 0) * minimumBuyingPrice,
        };
      } else {
        const selectedProduct = allProducts.find(
          (product) => product._id === selectedId
        );

        if (selectedProduct) {
          const initialTotal =
            (selectedProduct.newOrder || 0) *
            (selectedProduct.buyingPrice || 0);
          newProduct = {
            ...selectedProduct,
            newOrder: 0,
            recvQty: 0,
            balQty: 0,
            buyingPrice: selectedProduct.buyingPrice || 0,
            date_created: new Date(),
            vName: vendor.vName,
            contact_no: vendor.contact_no,
            email: vendor.email,
            address: vendor.address,
            gst_vat_no: vendor.gst_vat_no,
            po_Number: po_number,
            total: initialTotal,
          };
        }
      }

      setSelectedProductIds((prevIds) => [...prevIds, selectedId]);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setSelectedProductId(selectedId);
      setIsProductSelected(selectedId.length > 0);
    } catch (error) {
      console.error("Error fetching purchase data:", error);
      toast.error("Error fetching purchase data");
    }
  };

  const handleProductChange = (
    index: number,
    field: ProductField,
    value: string | number
  ) => {
    const updatedProducts = [...products];
    if (
      field === "newOrder" ||
      field === "buyingPrice" ||
      field === "gst" ||
      field === "recvQty" ||
      field === "balQty"
    ) {
      let parsedValue = 0; // Initialize with a default value
      // Check if the value is a valid number representation
      if (typeof value === "string" && !isNaN(parseFloat(value))) {
        parsedValue = parseFloat(value);
      }
      updatedProducts[index][field] = parsedValue;
      const buyingPrice = updatedProducts[index].buyingPrice;
      const received = updatedProducts[index].recvQty;
      const newOrder = updatedProducts[index].newOrder;

      if (newOrder < received) {
        toast.warning("Receive Qty is Gretar than Order Qty");
      } else if (received > 0) {
        updatedProducts[index].balQty = newOrder - received;
      } else {
        updatedProducts[index].balQty = newOrder;
      }

      if (received <= 0) {
        updatedProducts[index].status = "Pending";
      } else if (received === newOrder) {
        updatedProducts[index].status = "Received";
      } else {
        updatedProducts[index].status = "Partial";
      }

      updatedProducts[index].total = newOrder * buyingPrice;
    } else if (field === "total") {
      if (typeof value === "string" && !isNaN(parseFloat(value))) {
        updatedProducts[index][field] = parseFloat(value);
      } else {
        updatedProducts[index][field] = 0;
      }
    } else {
      (updatedProducts[index] as any)[field] = value;
    }
    setProducts(updatedProducts);
  };

  const removeProduct = (index: number) => {
    const updatedRows = [...products];
    const removedProductId = updatedRows[index]._id;
    updatedRows.splice(index, 1);
    setProducts(updatedRows);
    setSelectedProductIds((prevIds) =>
      prevIds.filter((id) => id !== removedProductId)
    );
    setIsProductSelected(products.length > 1);
    // setSelectedProductId(null);
  };

  const calculateSubTotal = () => {
    let subTotal = 0;
    products.forEach((product) => {
      const { total } = product;
      subTotal += total;
    });
    return subTotal.toFixed(2);
  };
  const gstAmount = () => {
    let gstValue = 0;
    products.forEach((product) => {
      const { total, gst } = product;
      gstValue += (total * gst) / 100;
    });
    return gstValue.toFixed(2);
  };
  const calculateGrandTotal = () => {
    const subTotal = parseFloat(calculateSubTotal());
    const gstValue = parseFloat(gstAmount());
    const grandTotal = subTotal + gstValue;
    return grandTotal.toFixed(2);
  };
  // po_number number generator
  const [po_number, setpo_number] = useState("");
  let companyId = "";

  if (session.status === "authenticated" && session.data?.user?.companyId) {
    companyId = session.data.user.companyId;
    // Now you can use companyId
  }
  const generatePurchaseNumber = useCallback(async () => {
    try {
      // Make an API call to fetch existing purchase order numbers for the company from the backend
      const response = await axios.get(`/api/purchase?companyId=${companyId}`);
      const companyPurchaseOrders = response.data;
      // Filter purchase orders for the current company
      const companyPurchaseOrderNumbers = companyPurchaseOrders
        .filter(
          (purchaseOrder: { companyId: string | undefined }) =>
            purchaseOrder.companyId === companyId
        )
        .map((purchaseOrder: { po_Number: string }) =>
          parseInt(purchaseOrder.po_Number.split("-")[2], 10)
        )
        .filter((number: number) => !isNaN(number));
      // Calculate the maximum purchase order number for the company and increment
      const maxPurchaseOrderNumber =
        companyPurchaseOrderNumbers.length > 0
          ? Math.max(...companyPurchaseOrderNumbers)
          : 0;
      const nextPurchaseOrderNumber = maxPurchaseOrderNumber + 1;
      // Generate the next unique purchase order number
      const todayDate = new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "");
      const newPurchaseOrderNumber = `${companyId}-${todayDate}-${nextPurchaseOrderNumber}`;
      setpo_number(newPurchaseOrderNumber);
    } catch (error) {
      console.log(error);
    }
  }, [companyId]);
  useEffect(() => {
    if (companyId) {
      generatePurchaseNumber();
    }
  }, [session.status, session.data, companyId, generatePurchaseNumber]);


  const handleRefresh = () => {
    // Implement a function to refresh product data in the ProductApi component
    // This function should make a request to get the latest product data and update the 'allProducts' state in ProductApi
    axios
      .get('/api/product')
      .then((response) => {
        const updatedProducts = response.data;
        // Call the 'updateProducts' function in the ProductApi to update the 'allProducts' state
        updateProducts(updatedProducts);
      })
      .catch((error) => {
        console.error('Error refreshing product data: ', error);
      });
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subTotal = calculateSubTotal();
    const totalGst = gstAmount();
    const grandTotal = calculateGrandTotal();
    const purchaseData = {
      po_Number: po_number,
      products: products,
      vName: vendor.vName,
      contact_no: vendor.contact_no,
      email: vendor.email,
      address: vendor.address,
      gst_vat_no: vendor.gst_vat_no,
      subTotal: subTotal,
      totalGst: totalGst,
      grandTotal: grandTotal,
      vendorID: selectedVendorId,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
      date_created: new Date(),
    };
    axios
      .post("/api/purchase", purchaseData)
      .then((response) => {
        toast.success("Purchase Created successfully");
        // After the POST request is successful, send a PUT request to update product quantities
        if (selectedProductIds.length === 1) {
          // Handle a single ID
          const productId = selectedProductIds[0];
          const product = products.find((product) => product._id === productId);
          const recvQty = product?.recvQty || 0; // Use the appropriate quantity field
          // Proceed with the PUT request to api/product for a single ID
          axios
            .put(`/api/product/${productId}`, { recvQty })
            .then((response) => {
              toast.success("Product updated successfully");
              handleRefresh();
              setSelectedVendorId(""); // Clear selected vendor
              setpo_number(""); // Clear po number
              setProducts([]); // Clear products
              setSelectedProductIds([]);
              setSelectedProductId(null);
              generatePurchaseNumber();
            })
            .catch((error) => {
              toast.error("Error updating Product");
              // Handle error of the PUT request
              console.error("Error updating product", error);
            });
        } else if (selectedProductIds.length > 1) {
          // Handle multiple IDs
          const productUpdates = products.map((product) => ({
            productId: product._id,
            recvQty: product.recvQty || 0, // Use the appropriate quantity field
          }));
          console.log(productUpdates);
          // Proceed with the PUT request to api/product for multiple IDs
          axios
            .put(`/api/product/${selectedProductIds.join(",")}`, {
              productUpdates,
            })
            .then((response) => {
              toast.success("Products updated successfully");
              handleRefresh();
              setSelectedVendorId(""); // Clear selected vendor
              setpo_number(""); // Clear po number
              setProducts([]); // Clear products
              setSelectedProductIds([]);
              setSelectedProductId(null);
              generatePurchaseNumber();
            })
            .catch((error) => {
              toast.error("Error updating Products");
              // Handle error of the PUT request
              console.error("Error updating products", error);
            });
        } else {
          toast.warning("No products selected for update");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Creating Purchase");
      });
  };

  if (session) {
    return (
      <>
        <Breadcrumb pageName="Add Purchase Order" />
        <form onSubmit={handleSubmit}className="shadow-sm shadow-warning px-4 py-2">
          <div className="flex flex-col sm:flex-row justify-center text-center gap-2  lg:gap-20 mt-6 mb-4">
            <div className={styles.heading}>Adding New Purchase </div>
            <div>
              <span className="text-lg "> Purchase Number </span>
              <input
                className="rounded h-6 bg-gray text-black text-center "
                type="text"
                name="po_Number"
                value={po_number}
                readOnly
              />
            </div>
          </div>

          <p className={styles.heading}> &#10146; Product Details</p>
          <>
            <div className="flex gap-8 px-6 mb-4">
              <select
                value={selectedVendorId}
                onChange={handleVendorSelect}
                required={true}
                className="w-full bg-transparent border px-4 py-2 rounded "

              >
                <option value="">Select Vendor</option>
                {allVendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id} className="text-black">
                    {vendor.vName}
                  </option>
                ))}
              </select>
              <select
                value={selectedProductId || ""}
                onChange={handleProductSelect}
                className="w-full bg-transparent border px-4 py-2 rounded "

                required={true}
                disabled={!selectedVendorId}
              >
                <option value="">Select Product</option>
                {allProducts.map((product) => (
                  <option key={product._id} value={product._id} className="text-black">
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center mb-4">
                <thead className="mb-4">
                  <tr className="text-xs text-center ">
                    <th className="px-2 py-1">Item</th>
                    <th className="px-2 py-1">iCode</th>
                    <th className="px-2 py-1">InStock</th>
                    <th className="px-2 py-1">Ordered</th>
                    <th className="px-2 py-1">Received</th>
                    <th className="px-2 py-1">Balance</th>
                    <th className="px-2 py-1">Rate</th>
                    <th className="px-2 py-1">Total</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">GST</th>
                    <th className="px-2 py-1">Remarks</th>
                    <th className="px-2 py-1"></th>
                  </tr>
                </thead>
                {products.length > 0 && (
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index} className="mb-4 py-2">
                        <td>
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
                            className="px-2 py-1 w-30 rounded text-black"
                            placeholder="P. code"
                            value={product.productCode.split("-")[1] ?? ""}
                            readOnly={true}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="px-2 py-1 w-15 rounded text-black"
                            value={product.inStock ?? 0}
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
                            min={1}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "newOrder",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="px-2 py-1 w-20 rounded text-black"
                            value={isNaN(product.recvQty) ? 0 : product.recvQty}
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
                            className="px-2 py-1 w-20 rounded text-black"
                            value={isNaN(product.balQty) ? 0 : product.balQty}
                            min={0}
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="px-2 py-1 w-25 rounded text-black"
                            value={product.buyingPrice ?? 0}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "buyingPrice",
                                e.target.value
                              )
                            }
                            min={0}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="px-2 py-1 w-25 rounded text-black"
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
                            className="px-2 py-1 w-30 rounded text-black"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial Received</option>
                            <option value="Received">Received</option>
                          </select>
                        </td>

                        <td>
                          <input
                            type="number"
                            className="px-2 py-1 w-15 rounded text-black"
                            min="0"
                            value={product.gst ?? 0}
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            placeholder="Remarks"
                            className="px-2 py-1 w-35 rounded text-black"
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
                        <td>
                          <FaTrash
                            className="text-danger text-center cursor-pointer"
                            type="button"
                            onClick={() => removeProduct(index)}
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
                <p>Sub Total: {calculateSubTotal()}</p>
              </div>
              <div>
                <p>Total GST: {gstAmount()}</p>
              </div>

              <div>
                <p>Grand Total: {calculateGrandTotal()}</p>
              </div>
            </div>
          </div>

          <hr className="mt-1" />
          <div className="flex py-2 px-2 mt-2 sm:px-80 gap-4 flex-col sm:flex-row">
            <button
              className={
                isProductSelected ? styles.saveButton : styles.disabledButton
              }
              onSubmit={handleSubmit}
              disabled={!isProductSelected}
            >
              Save
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
    );
  }
};
export default Purchase;
