"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import { PurchaseProduct } from "@/app/types/product";
import ReactApexChart from "react-apexcharts";

interface ChartOneProps {
  allPurchase: PurchaseProduct[]; // Pass your purchase data as a prop
}

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}
const options: ApexOptions = {
  legend: {
    show: true,
    position: "bottom",
    horizontalAlign: "center",
  },
  colors: [
    "#3C50E0",
    "#80CAEE",
    "#10B981",
    "#375E83",
    "#259AE6",
    "#FFA70B",
    "#ff6666",
  ],
  chart: {
    fontFamily: "sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: true,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,  
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: true,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 100,
  },
};
const ChartOne: React.FC<ChartOneProps> = ({ allPurchase }) => {
  const [chartOptions, setChartOptions] = useState<ChartOneState>({
    series: [
      {
        name: "",
        data: [],
        },
    ],
 
  });

  useEffect(() => {
    if (allPurchase) {
      // Create an object to store quantities by product name and month
      const quantitiesByMonth: Record<string, Record<string, number>> = {};

      // Extract unique months from your data
      const uniqueMonths: string[] = [];

      allPurchase.forEach((purchase) => {
        const dateCreated = new Date(purchase.date_created);
        const purchaseMonth = dateCreated.toLocaleDateString("en-US", {
          // year: "numeric",
          month: "short",
        });

        if (!uniqueMonths.includes(purchaseMonth)) {
          uniqueMonths.push(purchaseMonth);
        }

        purchase.products.forEach((product) => {
          const productName = product.productName;
          const quantity = product.recvQty + product.newRecvQty;

          // Initialize the quantities object for the month if it doesn't exist
          if (!quantitiesByMonth[purchaseMonth]) {
            quantitiesByMonth[purchaseMonth] = {};
          }

          // Update the quantity for the product in the specific month
          if (!quantitiesByMonth[purchaseMonth][productName]) {
            quantitiesByMonth[purchaseMonth][productName] = quantity;
          } else {
            quantitiesByMonth[purchaseMonth][productName] += quantity;
          }
        });
      });

      // Create series data based on quantitiesByMonth
      const seriesData = uniqueMonths.map((month) => ({
        name: month,
        data: Object.keys(quantitiesByMonth[month]).map((productName) => ({
          x: productName,
          y: quantitiesByMonth[month][productName] || 0,
        })),
      }));

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        series: seriesData,
      }));
    }
  }, [allPurchase]);

  return (
    <div className="col-span-10 rounded-sm border border-stroke bg-white px-3 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        <div id="chartOne" className="-ml-6 h-[330px] w-[105%] ">
          <ReactApexChart
            options={options}
            series={chartOptions.series || []}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
