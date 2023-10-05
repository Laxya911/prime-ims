"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import PurchaseOrder from "@/app/commonApi/purchaseApi";
import AllSells from "@/app/commonApi/salesApi";

interface ChartThreeState {
  series: number[];
  labels: string[];
}
const ChartThree: React.FC = () => {
  const { allPurchase } = PurchaseOrder();
  const { allSells } = AllSells();

  const [state, setState] = useState<ChartThreeState>({
    series: [],
    labels: [],
  });

  useEffect(() => {
    if (allPurchase.length > 0) {
      // Count the number of purchases made by each vendor
      const vendorPurchaseCounts: Record<string, number> = {};

      allPurchase.forEach((purchase) => {
        const vendorName = purchase.vName;
        if (vendorPurchaseCounts[vendorName]) {
          vendorPurchaseCounts[vendorName]++;
        } else {
          vendorPurchaseCounts[vendorName] = 1;
        }
      });
      // Sort vendors by purchase count in descending order
      const sortedVendors = Object.keys(vendorPurchaseCounts).sort(
        (a, b) => vendorPurchaseCounts[b] - vendorPurchaseCounts[a]
      );

      // Select the top 5 vendors
      const top5Vendors = sortedVendors.slice(0, 5);

      // Create data for the chart
      const chartData = {
        labels: top5Vendors, // Assign the labels directly
        series: top5Vendors.map((vendor) => vendorPurchaseCounts[vendor]),
      };
      setState(chartData);
    }
  }, [allPurchase]);

  // useEffect(() => {
  //   if (allSells.length > 0) {
  //     // Count the number of purchases made by each vendor
  //     const customerSellsCount: Record<string, number> = {};

  //     allSells.forEach((sells) => {
  //       const customerName = sells.customerName;
  //       if (customerSellsCount[customerName]) {
  //         customerSellsCount[customerName]++;
  //       } else {
  //         customerSellsCount[customerName] = 1;
  //       }
  //     });
  //     // Sort vendors by purchase count in descending order
  //     const sortedCustomer = Object.keys(customerSellsCount).sort(
  //       (a, b) => customerSellsCount[b] - customerSellsCount[a]
  //     );

  //     // Select the top 5 vendors
  //     const top5Customers = sortedCustomer.slice(0, 5);

  //     // Create data for the chart
  //     const chartData = {
  //       labels: top5Customers, // Assign the labels directly
  //       series: top5Customers.map((customer) => customerSellsCount[customer]),
  //     };
  //     setState(chartData);
  //   }
  // }, [allSells]);
  // useEffect(() => {
  //   if (allPurchase.length > 0 && allSells.length > 0) {
  //     // Count the number of purchases made by each vendor
  //     const vendorPurchaseCounts: Record<string, number> = {};
  //     const customerSellsCounts: Record<string, number> = {};

  //     allPurchase.forEach((purchase) => {
  //       const vendorName = purchase.vName;
  //       if (vendorPurchaseCounts[vendorName]) {
  //         vendorPurchaseCounts[vendorName]++;
  //       } else {
  //         vendorPurchaseCounts[vendorName] = 1;
  //       }
  //     });

  //     allSells.forEach((sells) => {
  //       const customerName = sells.customerName;
  //       if (customerSellsCounts[customerName]) {
  //         customerSellsCounts[customerName]++;
  //       } else {
  //         customerSellsCounts[customerName] = 1;
  //       }
  //     });

  //     // Sort vendors and customers by purchase/sell count in descending order
  //     const sortedVendors = Object.keys(vendorPurchaseCounts).sort(
  //       (a, b) => vendorPurchaseCounts[b] - vendorPurchaseCounts[a]
  //     );
  //     const sortedCustomers = Object.keys(customerSellsCounts).sort(
  //       (a, b) => customerSellsCounts[b] - customerSellsCounts[a]
  //     );

  //     // Select the top 5 vendors and customers
  //     const top5Vendors = sortedVendors.slice(0, 5);
  //     const top5Customers = sortedCustomers.slice(0, 5);

  //     // Create data for the chart
  //     const chartData = {
  //       labels: [...top5Vendors, ...top5Customers], // Combine labels for vendors and customers
  //       series: [
  //         ...top5Vendors.map((vendor) => vendorPurchaseCounts[vendor]),
  //         ...top5Customers.map((customer) => customerSellsCounts[customer]),
  //       ],
  //     };
  //     setState(chartData);
  //   }
  // }, [allPurchase, allSells]);

  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: state.labels,
    series: state.series,
    colors: ["#10B981", "#375E83", "#259AE6", "#FFA70B", "#ff6666"],
    legend: {
      show: true,
      position: "bottom",
    },
  };

  return (
    <div className=" justify-center">
      <p className="flex text-center justify-center">Top 5 Vendors</p>
      <div>
        <ReactApexChart options={options} series={state.series} type="pie" />
      </div>
    </div>
  );
};

export default ChartThree;
