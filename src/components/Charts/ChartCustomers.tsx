"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import AllSells from "@/app/commonApi/salesApi";

interface chartCustomer {
  series: number[];
  labels: string[];
}
const ChartCustomers: React.FC = () => {
  const { allSells } = AllSells();

  const [state, setState] = useState<chartCustomer>({
    series: [],
    labels: [],
  });

  useEffect(() => {
    if (allSells.length > 0) {
      // Count the number of purchases made by each vendor
      const customerSellsCount: Record<string, number> = {};

      allSells.forEach((sells) => {
        const customerName = sells.customerName;
        if (customerSellsCount[customerName]) {
          customerSellsCount[customerName]++;
        } else {
          customerSellsCount[customerName] = 1;
        }
      });
      // Sort vendors by purchase count in descending order
      const sortedCustomer = Object.keys(customerSellsCount).sort(
        (a, b) => customerSellsCount[b] - customerSellsCount[a]
      );

      // Select the top 5 vendors
      const top5Customers = sortedCustomer.slice(0, 5);

      // Create data for the chart
      const chartData = {
        labels: top5Customers, // Assign the labels directly
        series: top5Customers.map((customer) => customerSellsCount[customer]),
      };
      setState(chartData);
    }
  }, [allSells]);


  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: state.labels,
    series: state.series,
    colors: ["#259AE6", "#FFA70B", "#ff6666","#10B981", "#375E83" ],
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
      <p className="flex text-center justify-center">Top 5 Customers</p>
      <div>
        <ReactApexChart options={options} series={state.series} type="pie" />
      </div>
    </div>
  );
};

export default ChartCustomers;
