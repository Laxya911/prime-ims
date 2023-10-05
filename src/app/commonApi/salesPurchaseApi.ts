"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PurchaseOrder from "./purchaseApi";
import SalesApi from "./salesApi";

const SalesPurchases = () => {
  const session = useSession();

  const { allPurchase } = PurchaseOrder();
  const { allSells } = SalesApi();

  const [totalBuyingPrice, setTotalBuyingPrice] = useState(0);
  const [totalSells, setTotalSells] = useState(0);

  useEffect(() => {
    if (allPurchase) {
      // Create an object to store quantities by product name and month
      const totalSellsByProducts: Record<string, number> = {};
      allPurchase.forEach((purchase) => {
        purchase.products.forEach((product) => {
          const productName = product.productName;
          const quantity = product.recvQty + product.newRecvQty;
          // Check if either recvQty or newRecvQty is greater than 0
          if (quantity > 0) {
            const totalCost = product.buyingPrice * quantity;
            // Update the total buying price for this product
            if (!totalSellsByProducts[productName]) {
              totalSellsByProducts[productName] = totalCost;
            } else {
              totalSellsByProducts[productName] += totalCost;
            }
          }
        });
      });
      // Now, totalSellsByProducts contains the total buying price for each product
      // Calculate the total buying price across all products
      let totalBuyingPrice = 0;
      Object.keys(totalSellsByProducts).forEach((productName) => {
        totalBuyingPrice += totalSellsByProducts[productName];
      });
      setTotalBuyingPrice(totalBuyingPrice);
    }
  }, [allPurchase]);

  useEffect(() => {
    if (allSells) {
      let totalSellsAmount = 0;

      allSells.forEach((sell) => {
        const subTotal = parseFloat(sell.subTotal.replace(/,/g, ""));
        // Parse the subTotal value and accumulate it
        totalSellsAmount += subTotal;
      });

      // Set the totalSells state variable with the accumulated value
      setTotalSells(totalSellsAmount);
    }
  }, [allSells]);


  return {
    totalBuyingPrice,
    totalSells,
  };
};
export default SalesPurchases;
