"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "@/app/common.module.css";
import { useSession } from "next-auth/react";
import NotFound from "@/components/notFound";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Link from "next/link";
import Loading from "@/app/loading";
import AuthUsers from "@/utils/auth";

interface UpdateProps {
  params: {
    productid: string;
  };
}
const UpdatePO: React.FC<UpdateProps> = ({ params: { productid } }) => {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const { session } = AuthUsers();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [session.status, router]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    _id: "",
    productCode: "",
    productName: "",
    category: "",
    brand: "",
    quantity: "",
    buyingPrice: 0,
    sellingPrice: 0,
    unit: "",
    gst: 0,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/product/${productid}`);
        const productData = response.data;
        setFormData(productData);
        setLoading(false);
        console.log(productData);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (productid) {
      fetchDetails();
    }
  }, [productid]);

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    axios
      .put(`/api/product/${productid}`, formData, {
        headers: {
          "X-Product-Update": "true",
        },
      })
      .then((response) => {
        toast.success("Product Updated successfully");
        setIsDirty(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Updating Product");
      });
  };

  if (loading) {
    return <Loading />;
  }
  if (!formData || !formData._id) {
    return (
      <>
        <NotFound />
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Update Product" />
      {formData && (
        <div className="shadow-sm shadow-warning mt-2 rounded py-4">
          <h2 className="text-3xl text-center py-2 mb-2">
            &#10146; Product Details
          </h2>

          <div className="flex flex-col sm:flex-row justify-center text-center gap-4  lg:gap-20 mt-6 mb-4">
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
            <button className="bg-success rounded px-3 py-1">
              <Link href="/products" target="_blank">
                Add New Product
              </Link>
            </button>
          </div>

          <>
            <form onSubmit={handleSubmit} className={styles.formgroup}>
              {/* Display the selected purchase order data */}
              <div>
                <label htmlFor="quantity">Product</label>
                <input
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="Purchase Order Name"
                  value={formData.productName ? formData.productName : ""}
                  readOnly={true}
                />
              </div>
              <div>
                <label htmlFor="productCode">Product Code</label>
                <input
                  type="text"
                  name="productCode"
                  className={styles.input}
                  placeholder="Product Code"
                  value={formData.productCode ? formData.productCode : ""}
                  readOnly={true}
                />
              </div>
              <div>
                <label htmlFor="brand">Brand</label>
                <select
                  value={formData.brand ? formData.brand : ""}
                  onChange={handleChange}
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
                  value={formData.category ? formData.category : ""}
                  onChange={handleChange}
                  className={styles.input}
                >
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
                  value={formData.unit ? formData.unit : ""}
                  onChange={handleChange}
                  className={styles.input}
                >
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
                  value={formData.buyingPrice ? formData.buyingPrice : 0}
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
                  value={formData.sellingPrice ? formData.sellingPrice : 0}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="buying rate">GST</label>
                <input
                  type="number"
                  name="gst"
                  className={styles.input}
                  value={formData.gst ? formData.gst : 0}
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
                    Update
                  </button>
                </div>
                <div className="mt-6 w-full">
                  <button type="button" className={styles.cancelButton}>
                    <Link href="/"> Cancel</Link>
                  </button>
                </div>
                <div className="mt-6 w-full">
                  <button type="button" className={styles.editButton}>
                    <Link href="/products/view">Products</Link>
                  </button>
                </div>
              </div>
            </form>
          </>
        </div>
      )}
    </>
  );
};

export default UpdatePO;
