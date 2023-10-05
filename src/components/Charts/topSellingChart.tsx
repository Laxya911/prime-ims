"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import SalesApi from "@/app/commonApi/salesApi";

interface TopSellingStates {
  series: number[];
  labels: string[];
}
const TopSellingItems: React.FC = () => {


  const [state, setState] = useState<TopSellingStates>({
    series: [],
    labels: [],
  });

  const { topSellingItems } = SalesApi();
  useEffect(() => {
    if (topSellingItems.length > 0) {
      // Extract product names and sales counts from topSellingItems
      const productNames = topSellingItems.map((item) => item.productName);
      const salesCounts = topSellingItems.map((item) => item.salesCount);

      setState({
        labels: productNames,
        series: salesCounts,
      });
    }
  }, [topSellingItems]);
  
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
      <p className="flex text-center justify-center">Top Selling Items</p>
      <div>
        <ReactApexChart options={options} series={state.series} type="pie" />
      </div>
    </div>
  );
};

export default TopSellingItems;
