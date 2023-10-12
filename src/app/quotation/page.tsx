"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseProduct } from "../types/product";
import AuthUsers from "@/utils/auth";
import ProductApi from "../commonApi/productApi";
import CustomerApi from "../commonApi/customerApi";
import Loading from "../loading";

type ProductField = keyof PurchaseProduct;

const Quotations = () => {
  const router = useRouter();
  const { session } = AuthUsers();

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

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedCustomerId(selectedId);
    const selectedCustomer = allCustomers.find(
      (customer) => customer._id === selectedId
    );

    if (selectedCustomer) {
      setCustomer(selectedCustomer);
    }
    // Reset product related states when a new customer is selected
    setProducts([]);
    setSelectedProductId(null);
    setSelectedProductIds([]);
  };
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
      // Make an API call to fetch the quotation data for the selected customer
      const quoteResponse = await axios.get(
        `/api/quotation?customerId=${selectedCustomerId}`
      );

      let maximumSellingPrice = Number.MIN_SAFE_INTEGER; // Initialize with a small value
      let matchingProduct: PurchaseProduct | undefined = undefined;

      for (const quote of quoteResponse.data) {
        const selectedCustomerProducts = quote.products.filter(
          (product: { customerId: string; customerName: string }) =>
            product.customerId === selectedCustomerId ||
            product.customerName === customer.customerName
        );

        for (const product of selectedCustomerProducts) {
          if (
            product._id === selectedId &&
            product.sellingPrice > maximumSellingPrice
          ) {
            maximumSellingPrice = product.sellingPrice;
            matchingProduct = product;
          }
        }
      }
      let newProduct: PurchaseProduct;
      if (matchingProduct) {
        newProduct = {
          ...selectedProduct!,
          newOrder: 0,
          recvQty: 0,
          balQty: 0,
          sellingPrice: maximumSellingPrice,
          date_created: new Date(),
          customerName: customer.customerName,
          contact_no: customer.contact_no,
          email: customer.email,
          address: customer.address,
          gst_vat_no: customer.gst_vat_no,
          qNumber: qNumber,
          total: (selectedProduct?.newOrder || 0) * maximumSellingPrice,
        };
      } else {
        // If no matching product is found, use the product's default sellingPrice
        const selectedProduct = allProducts.find(
          (product) => product._id === selectedId
        );
        if (selectedProduct) {
          const initialTotal =
            (selectedProduct.newOrder || 0) *
            (selectedProduct.sellingPrice || 0);
          newProduct = {
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
            qNumber: qNumber,
            total: initialTotal,
          };
        }
      }

      setSelectedProductIds((prevIds) => [...prevIds, selectedId]);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      setSelectedProductId(selectedId);
      setIsProductSelected(selectedId.length > 0);
    } catch (error) {
      console.error("Error fetching quotation data:", error);
      toast.error("Error fetching quotation data");
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
        updatedProducts[index].status = "Sent";
      } else {
        updatedProducts[index].status = "Partial";
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
    // setSelectedProductId(null);
    setIsProductSelected(products.length > 1);
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
  // qNumber number generator
  const [qNumber, setqNumber] = useState("");
  let companyId = "";

  if (session.status === "authenticated" && session.data?.user?.companyId) {
    companyId = session.data.user.companyId;
    // Now you can use companyId
  }
  const generateQuotationNumber = useCallback(async () => {
    try {
      // Make an API call to fetch existing quotation numbers for the company from the backend
      const response = await axios.get(`/api/quotation?companyId=${companyId}`);
      const companyQuotationNumber = response.data;
      // Map and parse the existing quotation numbers
      const companyQuoteNumbers = companyQuotationNumber
        .filter(
          (purchaseOrder: { companyId: string; qNumber: string }) =>
            purchaseOrder.companyId === companyId
        )
        .map((purchaseOrder: { qNumber: string }) => {
          const parts = purchaseOrder.qNumber.split("-");
          const lastPart = parts[parts.length - 1];
          return parseInt(lastPart, 10);
        })
        .filter((number: number) => !isNaN(number));

      // Calculate the maximum quotation number for the company and increment
      const maxQnumber =
        companyQuoteNumbers.length > 0 ? Math.max(...companyQuoteNumbers) : 0;
      const nextQnumber = maxQnumber + 1;

      // Generate the next unique quotation number
      const todayDate = new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "");
      const newQnumber = `${companyId}-${todayDate}-QT-${nextQnumber}`;
      setqNumber(newQnumber);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) {
      generateQuotationNumber();
    }
  }, [session.status, session.data, companyId, generateQuotationNumber]);

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
    const quoteData = {
      qNumber: qNumber,
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
      .post("/api/quotation", quoteData)
      .then((response) => {
        toast.success("Quotation Created successfully");
        handleRefresh();
        setSelectedCustomerId(""); // Clear selected vendor
        setqNumber("");
        setProducts([]); // Clear products
        setSelectedProductIds([]);
        setSelectedProductId(null);
        generateQuotationNumber();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Creating Purchase");
      });
  };
if (loading){
  return(
    <Loading/>
  )
}

  if (session) {
    return (
      <>
        <Breadcrumb pageName="Add Quotation" />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row justify-center text-center gap-2  lg:gap-20 mt-6 mb-4">
            <div className={styles.heading}>Adding New Quotation </div>
            <div>
              <span className="text-lg "> Quotation Number </span>
              <input
                className="rounded h-6 bg-gray text-black text-center "
                type="text"
                name="qNumber"
                value={qNumber}
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
                    <th className="px-2 py-1 w-30">P Name</th>
                    <th className="px-2 py-1 w-30">P Code</th>
                    <th className="px-2 py-1 w-15">In Stock</th>
                    <th className="px-2 py-1 w-20">Order </th>
                    <th className="px-2 py-1 w-20">Sent </th>
                    <th className="px-2 py-1 w-30">Balance </th>
                    <th className="px-2 py-1 w-20">Rate</th>
                    <th className="px-2 py-1 w-20">Total</th>
                    <th className="px-2 py-1 w-35">Status</th>
                    <th className="px-2 py-1 w-15">GST</th>
                    <th className="px-2 py-1 w-20">Remarks</th>
                    <th className="px-2 py-1 w-20"></th>
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
                            className="px-2 py-1 w-30 rounded"
                            readOnly={true}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="px-2 py-1 w-20 rounded"
                            placeholder="P. code"
                            value={product.productCode.split("-")[1] ?? ""}
                            readOnly={true}
                          />
                        </td>

                        <td>
                          <input
                            type="number"
                            className="px-2 py-1 w-15 rounded"
                            value={product.inStock ?? 0}
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
                            className="px-2 py-1 w-20 rounded"
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
                            className="px-2 py-1 w-30 rounded"
                            value={isNaN(product.balQty) ? 0 : product.balQty}
                            min={0}
                            readOnly={true}
                          />
                        </td>
                        <td className="px-4">
                          <input
                            type="number"
                            className="px-2 py-1 w-30 rounded"
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
                            className="px-2 py-1 w-30 rounded"
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
                            className="px-2 py-1 w-36 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Partial">Partial Sent</option>
                            <option value="Sent">Sent</option>
                          </select>
                        </td>

                        <td className="px-4">
                          <input
                            type="number"
                            className="px-2 py-1 w-15 rounded"
                            min="0"
                            value={product.gst ?? 0}
                            readOnly={true}
                          />
                        </td>
                        <td className="px-4">
                          <input
                            type="text"
                            placeholder="Remarks"
                            className="px-2 py-1 w-30 rounded"
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
              <Link href="/purchase/view"> Check PO</Link>
            </button>
          </div>
        </form>
      </>
    );
  }
};
export default Quotations;
