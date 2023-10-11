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

interface UpdateProps {
  params: {
    productid: string;
  };
}
const UpdatePO: React.FC<UpdateProps> = ({ params: { productid } }) => {
  const session = useSession();
  const router = useRouter();

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
        <>
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

          <div className="shadow py-2">
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
                  value={formData.category ? formData.category : ""}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      category: e.target.value,
                    }))
                  }
                  className={styles.input}
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
                  value={formData.buyingPrice ? formData.buyingPrice : 0}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      buyingPrice: parseFloat(e.target.value),
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
                  value={formData.sellingPrice ? formData.sellingPrice : 0}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      sellingPrice: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label htmlFor="buying rate">GST</label>
                <input
                  type="number"
                  name="gst"
                  className={styles.input}
                  value={formData.gst ? formData.gst : 0}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      gst: parseFloat(e.target.value),
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
                    <Link href="/products/view">Products</Link>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePO;
