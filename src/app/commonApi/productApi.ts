"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import { PurchaseProduct } from "@/app/types/product";

const ProductApi = () => {
  const session = useSession();

  const [allProducts, setAllProducts] = useState<PurchaseProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/product`);
        const data = await response.json();
        // console.log(data)
        // Filter Products based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Products for superadmin
            const sortedPurchaseOrder = data.sort(
              (a: PurchaseProduct, b: PurchaseProduct) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllProducts(sortedPurchaseOrder);
          } else {
            // Filter Products to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (po: { companyId: string }) =>
                po.companyId === session.data.user.companyId
            );
            const sortedPurchaseOrder = filteredData.sort(
              (a: PurchaseProduct, b: PurchaseProduct) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllProducts(sortedPurchaseOrder);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [session.status, session.data]);

  const updateProducts = (updatedProducts: PurchaseProduct[]) => {
    // Update the allProducts state with the new data
    setAllProducts(updatedProducts);
  };


  const handleDelete = (_id: string) => {
    if (typeof window !== "undefined") {
      const shouldDelete = window.confirm("Are You Sure to Delete??");
      if (shouldDelete) {
        axios
          .delete(`/api/product/${_id}`)
          .then((response) => {
            console.log(response.data); // Handle the response data
            toast.success("Product Deleted Successfully");
            setAllProducts((prevInvoice) =>
              prevInvoice.filter((allProducts) => allProducts._id !== _id)
            );
          })
          .catch((error) => {
            toast.error("Product Not Deleted");
            console.error(error); // Handle the error
          });
      }
    }
  };
  return {
    allProducts,
    updateProducts,
    handleDelete,
  };
};
export default ProductApi;
