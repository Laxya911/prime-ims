"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "../common.module.css";
import JsBarcode from "jsbarcode";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FaBarcode } from "react-icons/fa";
import AuthUsers from "@/utils/auth";

const ProductPage = () => {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const { session } = AuthUsers();
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
  const handleChange = (e: {
    target: { name: string | number; value: string | number };
  }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsDirty(true);
  };
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
        setIsDirty(false);
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
        <div className=" py-4 shadow-sm shadow-warning">
        <div className=" rounded py-2 flex flex-col sm:flex-row justify-center text-center gap-4  lg:gap-20 mt-2 mb-2">
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
        </div>
          <form onSubmit={handleSubmit} className={styles.formgroup}>
            <div>
              <label htmlFor="buying rate">Product Name</label>
              <input
                type="text"
                name="productName"
                className={styles.input}
                placeholder="Product Name"
                required={true}
                value={formData.productName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="symbology">Select Barcode Symbology</label>
              <select
                value={selectedSymbology}
                onChange={(e) => setSelectedSymbology(e.target.value)}
                className={styles.input}
                name="symbology"
              >
                <option value="CODE128" className="text-black">CODE128</option>
                <option value="CODE39" className="text-black">CODE39</option>
                <option value="EAN8" className="text-black">EAN8</option>
                <option value="EAN13" className="text-black">EAN13</option>
                <option value="UPC" className="text-black">UPC</option>
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
                  required={true}
                  readOnly={true}
                />
              </span>
            </div>
            <div>
              <label htmlFor="brand">Brand</label>
              <select
                value={formData.brand}
                name="brand"
                onChange={handleChange}
                required={true}
                className={styles.input}
              >
                <option value="">Select Brand</option>
                <option value="apple"className="text-black">Apple</option>
                <option value="samsung"className="text-black">Samsung</option>
                <option value="primetek"className="text-black">Primetek</option>
              </select>
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.input}
                required={true}
              >
                <option value="">Select Category</option>
                <option value="Electronic"className="text-black">Electronics</option>
                <option value="Machinery"className="text-black">Machinery</option>
                <option value="Spare Parts"className="text-black">Spare Parts</option>
                <option value="Mobiles"className="text-black">Mobiles</option>
                <option value="Laptops"className="text-black">Laptops</option>
                <option value="Furniture"className="text-black">Furniture</option>
                <option value="Plasticware"className="text-black">Plasticware</option>
                <option value="Accessories"className="text-black">Accessories</option>
              </select>
            </div>
            <div>
              <label htmlFor="unit">Unit</label>
              <select
                name="unit"
                value={formData.unit ? formData.unit : ""}
                onChange={handleChange}
                required={true}
                className={styles.input}
              >
                <option value="">Select Unit</option>
                <option value="PCS"className="text-black">PCS</option>
                <option value="KG"className="text-black">KG</option>
                <option value="Dozens"className="text-black">Dozens</option>
                <option value="Meters"className="text-black">Meters</option>
                <option value="Box"className="text-black">Box</option>
                <option value="MM"className="text-black">MM</option>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-between gap-4 px-2">
              <div className="mt-6 w-full">
                <button
                  onSubmit={handleSubmit}
                  className={
                    isDirty ? styles.saveButton : styles.disabledButton
                  }
                  disabled={!isDirty}
                >
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
