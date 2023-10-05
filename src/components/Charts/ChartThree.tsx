"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
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
  // NextJS Requirement
  const isWindowAvailable = () => typeof window !== "undefined";

  if (!isWindowAvailable()) return <></>;
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
