"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseProduct } from "../types/product";
import ProductApi from "../commonApi/productApi";
import CustomerApi from "../commonApi/customerApi";

type ProductField = keyof PurchaseProduct;

const CreateInvoice = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PurchaseProduct[]>([]);

  const {allProducts, updateProducts} = ProductApi();

  const [customer, setCustomer] = useState({
    customerName: "",
    contact_no: "",
    email: "",
    address: "",
    gst_vat_no: "",
  });

  const {allCustomers} = CustomerApi();

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedCustomerId(selectedId);
    // Find the selected vendor's data and populate the input fields
    const selectedCustomer = allCustomers.find(
      (customer) => customer._id === selectedId
    );
    if (selectedCustomer) {
      setCustomer(selectedCustomer);
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

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    if (selectedProductIds.includes(selectedId)) {
      toast.error("Product already selected.");
      return;
    }

    const selectedProduct = allProducts.find(
      (product) => product._id === selectedId
    );

    if (selectedProduct) {
      // Create a new product object with default values
      const newProduct: PurchaseProduct = {
        ...selectedProduct,
        newOrder: 0,
        recvQty: 0,
        balQty: 0,
        sellingPrice: selectedProduct.sellingPrice || 0,
        date_created: new Date(),
        customerName: customer.customerName,
        contact_no: customer.contact_no,
        email: customer.email,
        address: customer.address,
        gst_vat_no: customer.gst_vat_no,
        invoiceNumber: invoiceNumber,
        total: 0, // You can calculate the total based on newOrder and sellingPrice
      };
      // Add the selected product to the products list
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setSelectedProductId(selectedId);
      // Add the selected product's ID to the selectedProductIds
      setSelectedProductIds((prevIds) => [...prevIds, selectedId]);
      setIsProductSelected(selectedId.length > 0);

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
      field === "sellingPrice" ||
      field === "gst" ||
      field === "recvQty" ||
      field === "inStock" ||
      field === "balQty"
    ) {
      let parsedValue = 0; // Initialize with a default value
      // Check if the value is a valid number representation
      if (typeof value === "string" && !isNaN(parseFloat(value))) {
        parsedValue = parseFloat(value);
      }
      updatedProducts[index][field] = parsedValue;
      const sellingPrice = updatedProducts[index].sellingPrice;
      const received = updatedProducts[index].recvQty;
      const newOrder = updatedProducts[index].newOrder;
      const inStock = updatedProducts[index].inStock;

      if (newOrder > inStock) {
        toast.warning("No more Qty Left");
      } else if (received > 0) {
        updatedProducts[index].balQty = newOrder - received;
      } else {
        updatedProducts[index].balQty = newOrder;
      }

      updatedProducts[index].total = newOrder * sellingPrice;
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

  // invoice number generator
  const [invoiceNumber, setInvoiceNumber] = useState("");
  let companyId = "";

  if (session.status === "authenticated" && session.data?.user?.companyId) {
    companyId = session.data.user.companyId;
    // Now you can use companyId
  }

  const generateInvoiceNumber = useCallback(async () => {
    try {
      // Make an API call to fetch existing invoice numbers for the company from the backend
      const response = await axios.get(
        `/api/primeinvoice?companyId=${companyId}`
      );
      const companyInvoices = response.data;

      const companyInvoiceNumbers = companyInvoices
        .filter(
          (invoice: { companyId: string; invoiceNumber: string }) =>
            invoice.companyId === companyId
        )
        .map((invoice: { invoiceNumber: string }) => {
          const parts = invoice.invoiceNumber.split("-");
          const lastPart = parts[parts.length - 1];
          return parseInt(lastPart, 10);
        })
        .filter((number: number) => !isNaN(number));
      // Calculate the maximum invoice number for the company and increment
      const maxInvoiceNumber =
        companyInvoiceNumbers.length > 0
          ? Math.max(...companyInvoiceNumbers)
          : 0;
      const nextInvoiceNumber = maxInvoiceNumber + 1;
      // Generate the next unique invoice number
      const todayDate = new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "");
      const newInvoiceNumber = `${companyId}-${todayDate}-INV-${nextInvoiceNumber}`;
      setInvoiceNumber(newInvoiceNumber);
    } catch (error) {
      console.log(error);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      generateInvoiceNumber();
    }
  }, [session, session.data, companyId, generateInvoiceNumber]);

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
    const invoiceData = {
      invoiceNumber: invoiceNumber,
      products: products,
      customerName: customer.customerName,
      contact_no: customer.contact_no,
      email: customer.email,
      address: customer.address,
      gst_vat_no: customer.gst_vat_no,
      subTotal: subTotal,
      totalGst: totalGst,
      grandTotal: grandTotal,
      customerId: selectedCustomerId,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
      date_created: new Date(),
    };
    axios
      .post("/api/primeinvoice", invoiceData)
      .then((response) => {
        toast.success("Invoice Created successfully");
        // After the POST request is successful, send a PUT request to update product quantities
        if (selectedProductIds.length === 1) {
          // Handle a single ID
          const productId = selectedProductIds[0];
          const product = products.find((product) => product._id === productId);
          const newOrder = product?.newOrder || 0; // Use the appropriate quantity field
          // Proceed with the PUT request to api/product for a single ID
          axios
            .put(`/api/product/${productId}`, { newOrder })
            .then((response) => {
              toast.success("Product updated successfully");
              handleRefresh();
              setSelectedCustomerId(""); // Clear selected vendor
              setInvoiceNumber(""); // Clear po number
              setProducts([]); // Clear products
              setSelectedProductIds([]);
              setSelectedProductId(null);
              generateInvoiceNumber();
            })
            .catch((error) => {
              toast.error("Error updating Product");
              console.error("Error updating product", error);
            });
        } else if (selectedProductIds.length > 1) {
          // Handle multiple IDs
          const productUpdates = products.map((product) => ({
            productId: product._id,
            newOrder: product.newOrder || 0, // Use the appropriate quantity field
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
              setSelectedCustomerId(""); // Clear selected vendor
              setInvoiceNumber(""); // Clear po number
              setProducts([]); // Clear products
              setSelectedProductIds([]);
              setSelectedProductId(null);
              generateInvoiceNumber();
            })
            .catch((error) => {
              toast.error("Error updating Products");
              // Handle error of the PUT request
              console.error("Error updating products", error);
            });
        } else {
          // Handle the case where no products are selected
          toast.warning("No products selected for update");
        }
      })
      .catch((error) => {
        // Handle error of the POST request
        console.log(error);
        toast.error("Error Creating Invoice");
      });
  };

  if (session) {
    return (
      <>
        <Breadcrumb pageName="Add Invoices" />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row justify-center text-center gap-2  lg:gap-20 mt-6 mb-4">
            <div className={styles.heading}>Adding New Invoice </div>
            <div>
              <span className="text-lg "> Invoice Number </span>
              <input
                className="rounded h-6 bg-gray text-black text-center "
                type="text"
                name="invoiceNumber"
                value={invoiceNumber}
                readOnly
              />
            </div>
          </div>

          <p className={styles.heading}> &#10146; Product Details</p>
          <>
            <div className="flex gap-8 px-6 mb-4">
              <select
                value={selectedCustomerId}
                onChange={handleCustomerSelect}
                required={true}
                className={styles.input}
              >
                <option value="">Select Customer</option>
                {allCustomers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
              <select
                value={selectedProductId || ""}
                onChange={handleProductSelect}
                className={styles.input}
                required={true}
                disabled={!selectedCustomerId}
              >
                <option value="">Select Product</option>
                {allProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center mb-4">
                <thead className="mb-4">
                  <tr className="text-xs text-center ">
                    <th className="px-1 py-1 w-30">Item</th>
                    <th className="px-1 py-1 w-30">iCode</th>
                    <th className="px-1 py-1 w-15">InStock</th>
                    <th className="px-1 py-1 w-20">Qty </th>
                    <th className="px-1 py-1 w-20">Rate</th>
                    <th className="px-1 py-1 w-20">Total</th>
                    <th className="px-1 py-1 w-35">Payment</th>
                    <th className="px-1 py-1 w-15">GST</th>
                    <th className="px-1 py-1 w-20">Remarks</th>
                    <th className="px-1 py-1 w-20"></th>
                  </tr>
                </thead>
                {products.length > 0 && (
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={index} className="mb-4 py-2">
                        <td className="px-4">
                          <input
                            type="text"
                            value={product.productName ?? ""}
                            placeholder="P. Name"
                            className="px-1 py-1 w-30 rounded"
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="px-1 py-1 w-20 rounded"
                            placeholder="P. code"
                            value={product.productCode.split("-")[1] ?? ""}
                            readOnly={true}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="px-1 py-1 w-15 rounded"
                            value={product.inStock ?? 0}
                            readOnly={true}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="px-1 py-1 w-20 rounded"
                            value={
                              isNaN(product.newOrder) ? 0 : product.newOrder
                            }
                            required={true}
                            min={1}
                            max={product.inStock}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "newOrder",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="px-4">
                          <input
                            type="number"
                            className="px-1 py-1 w-30 rounded"
                            value={product.sellingPrice ?? 0}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "sellingPrice",
                                e.target.value
                              )
                            }
                            min={0}
                          />
                        </td>
                        <td className="px-4">
                          <input
                            type="number"
                            className="px-1 py-1 w-30 rounded"
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
                            className="px-1 py-1 w-36 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial Paid</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </td>

                        <td className="px-4">
                          <input
                            type="number"
                            className="px-1 py-1 w-15 rounded"
                            min="0"
                            value={product.gst ?? 0}
                            readOnly={true}
                          />
                        </td>
                        <td className="px-4">
                          <input
                            type="text"
                            placeholder="Remarks"
                            className="px-1 py-1 w-30 rounded"
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
                        <td className="px-4">
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
              <Link href="/invoice/view">Invoices</Link>
            </button>
          </div>
        </form>
      </>
    );
  }
};
export default CreateInvoice;
