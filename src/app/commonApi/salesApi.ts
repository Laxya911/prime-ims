"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PurchaseProduct } from "@/app/types/product";

// const SalesApi = () => {
//   const session = useSession();

//   const [allSells, setAllSells] = useState<PurchaseProduct[]>([]);

//   useEffect(() => {
//     const fetchTotalSales = async () => {
//       try {
//         const response = await fetch(`/api/primeinvoice`);
//         const data = await response.json();
//         // Filter Invoices based on user role and ownership
//         if (session.status === "authenticated" && session.data) {
//           if (session.data.user.role === "superadmin") {
//             // Display all Invoices for superadmin
//             const sortedInvoices = data.sort(
//               (a: PurchaseProduct, b: PurchaseProduct) =>
//                 new Date(b.date_created).getTime() -
//                 new Date(a.date_created).getTime()
//             );
//             setAllSells(sortedInvoices);
//           } else {
//             // Filter Invoices to display only the ones created by the logged-in user
//             const filteredData = data.filter(
//               (consignment: { companyId: string; }) =>
//                 consignment.companyId === session.data.user.companyId
//             );
//             const sortedInvoices = filteredData.sort(
//               (a: PurchaseProduct, b: PurchaseProduct) =>
//                 new Date(b.date_created).getTime() -
//                 new Date(a.date_created).getTime()
//             );
//             setAllSells(sortedInvoices);
//           }
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchTotalSales();
//   }, [session.status, session.data]);

//   return {
//     allSells,
//   };
// };


const SalesApi = () => {
  const session = useSession();

  const [allSells, setAllSells] = useState<PurchaseProduct[]>([]);
  const [topSellingItems, setTopSellingItems] = useState<{ productName: string; salesCount: number }[]>([]);

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const response = await fetch(`/api/primeinvoice`);
        const data = await response.json();
        // Filter Invoices based on user role and ownership
        if (session.status === "authenticated" && session.data) {
          if (session.data.user.role === "superadmin") {
            // Display all Invoices for superadmin
            const sortedInvoices = data.sort(
              (a: PurchaseProduct, b: PurchaseProduct) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllSells(sortedInvoices);
          } else {
            // Filter Invoices to display only the ones created by the logged-in user
            const filteredData = data.filter(
              (consignment: { companyId: string }) =>
                consignment.companyId === session.data.user.companyId
            );
            const sortedInvoices = filteredData.sort(
              (a: PurchaseProduct, b: PurchaseProduct) =>
                new Date(b.date_created).getTime() -
                new Date(a.date_created).getTime()
            );
            setAllSells(sortedInvoices);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalSales();
  }, [session.status, session.data]);

  useEffect(() => {
    if (allSells.length > 0) {
      // Count the number of times each productName appears
      const productNameCounts: Record<string, number> = {};

      allSells.forEach((sell) => {
        sell.products.forEach((product) => {
          const productName = product.productName;
          if (productNameCounts[productName]) {
            productNameCounts[productName]++;
          } else {
            productNameCounts[productName] = 1;
          }
        });
      });

      // Convert productNameCounts into an array of objects
      const topSellingItemsArray = Object.keys(productNameCounts).map((productName) => ({
        productName,
        salesCount: productNameCounts[productName],
      }));

      // Sort the topSellingItemsArray by salesCount in descending order
      topSellingItemsArray.sort((a, b) => b.salesCount - a.salesCount);

      // Select the top 5 selling products
      const top5SellingItems = topSellingItemsArray.slice(0, 5);

      // Set the top selling items in state
      setTopSellingItems(top5SellingItems);
    }
  }, [allSells]);

  return {
    allSells,
    topSellingItems,
  };
};

export default SalesApi;
