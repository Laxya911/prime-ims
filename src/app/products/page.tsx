"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "../common.module.css";
import { useSession } from "next-auth/react";
import JsBarcode from "jsbarcode";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FaBarcode } from "react-icons/fa";

const ProductPage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);

  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    category: "",
    brand: "",
    status: "",
    quantity: 0,
    buyingPrice: "",
    gst: 0,
    sellingPrice: "",
    unit: "",
  });

  const generateUniqueCode = () => {
    // Generate a unique code here based on your logic
    const uniqueCode = Math.floor(10000000 + Math.random() * 90000000);
    // Return the unique code as a string
    return uniqueCode.toString();
  };

  const [selectedSymbology, setSelectedSymbology] = useState("CODE128"); // Default to CODE128

  const generateBarcode = () => {
    // Generate a unique code on the client-side
    const uniqueCode = generateUniqueCode();
    const barcodeValue = `${uniqueCode}`;

    // Populate the input field directly
    setFormData((prevState) => ({
      ...prevState,
      productCode: barcodeValue,
    }));

    // Render the barcode
    JsBarcode("#barcode", barcodeValue, {
      format: selectedSymbology,
      displayValue: false,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...formData,
      productCode: `${session?.data?.user.companyId}-${formData.productCode}`,
      created_by: session?.data?.user.email,
      companyId: session?.data?.user.companyId,
    };

    axios
      .post("/api/product", payload)
      .then((response) => {
        toast.success("Product Created successfully");
        setFormData({
          productName: "",
          productCode: "",
          category: "",
          brand: "",
          status: "",
          quantity: 0,
          buyingPrice: "",
          gst: 0,
          sellingPrice: "",
          unit: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Creating product");
      });
  };

  if (session) {
    return (
      <>
        <Breadcrumb pageName="Add Product" />
        <div className="flex flex-col sm:flex-row justify-center text-center gap-4  lg:gap-20 mt-6 mb-2">
          <button className="bg-success rounded px-3  py-1">
            <Link href="/vendor" target="_blank">
              Add New Vendor
            </Link>
          </button>
          <button className="bg-success rounded px-3 py-1">
            <Link href="/purchase" target="_blank">
              Add New PO
            </Link>
          </button>
          <div className={styles.heading}>Adding New Product </div>
        </div>
        <div className="shadow py-2">
          <form onSubmit={handleSubmit} className={styles.formgroup}>
            <div>
              <label htmlFor="buying rate">Product Name</label>
              <input
                type="text"
                name="productName"
                className={styles.input}
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    productName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="symbology">Select Barcode Symbology</label>
              <select
                value={selectedSymbology}
                onChange={(e) => setSelectedSymbology(e.target.value)}
                className={styles.input}
              >
                <option value="CODE128">CODE128</option>
                <option value="CODE39">CODE39</option>
                <option value="EAN8">EAN8</option>
                <option value="EAN13">EAN13</option>
                <option value="UPC">UPC</option>
              </select>
            </div>

            <svg id="barcode" className="hidden"></svg>
            <div>
              <label htmlFor="productCode">Product Code</label>
              <span className="flex border rounded-sm gap-2 ">
                <div className="mt-2 px-2 text-xl h-6 w-8">
                  <FaBarcode onClick={generateBarcode} />
                </div>
                <input
                  type="text"
                  name="productCode"
                  className={styles.input}
                  placeholder="Product Code"
                  value={formData.productCode}
                  readOnly={true}
                />
              </span>
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <select
                value={formData.brand}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    brand: e.target.value,
                  }))
                }
                className={styles.input}
              >
                <option value="">Select Brand</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="primetek">Primetek</option>
              </select>
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    category: e.target.value,
                  }))
                }
                className={styles.input}
                required={true}
              >
                <option value="">Select Category</option>
                <option value="Electronic">Electronics</option>
                <option value="Machinery">Machinery</option>
                <option value="Spare Parts">Spare Parts</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Laptops">Laptops</option>
                <option value="Furniture">Furniture</option>
                <option value="Plasticware">Plasticware</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label htmlFor="unit">Unit</label>
              <select
                value={formData.unit ? formData.unit : ""}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    unit: e.target.value,
                  }))
                }
                required={true}
                className={styles.input}
              >
                <option value="">Select Unit</option>
                <option value="PCS">PCS</option>
                <option value="KG">KG</option>
                <option value="Dozens">Dozens</option>
                <option value="Meters">Meters</option>
                <option value="Box">Box</option>
                <option value="MM">MM</option>
              </select>
            </div>
            <div>
              <label htmlFor="buying rate">Buying Rate</label>
              <input
                type="text"
                name="buyingPrice"
                className={styles.input}
                placeholder="Buying Rate"
                value={formData.buyingPrice}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    buyingPrice: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="gst">GST</label>
              <input
                type="number"
                name="gst"
                className={styles.input}
                placeholder="vat/gst"
                value={formData.gst}
                min={0}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    gst: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label htmlFor="selling rate">Selling Rate</label>
              <input
                type="text"
                name="sellingPrice"
                className={styles.input}
                placeholder="Selling Rate"
                value={formData.sellingPrice}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    sellingPrice: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-between gap-4 px-2">
            <div className="mt-6 w-full">
              <button className={styles.saveButton} onSubmit={handleSubmit}>
                Save
              </button>
            </div>
            <div className="mt-6 w-full">
              <button type="button" className={styles.cancelButton}>
                <Link href="/"> Cancel</Link>
              </button>
            </div>
            <div className="mt-6 w-full">
              <button type="button" className={styles.editButton}>
                <Link href="/products/view"> Products</Link>
              </button>
            </div>
            </div>
          </form>
        </div>
      </>
    );
  }
};
export default ProductPage;
