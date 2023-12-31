"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import { PurchaseProduct } from "@/app/types/product";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import SalesPurchases from "@/app/commonApi/salesPurchaseApi";

interface ChartOneProps {
  allPurchase: PurchaseProduct[]; // Pass your purchase data as a prop
}

const ChartOne: React.FC<ChartOneProps> = ({ allPurchase }) => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    colors: [
      "#3056D3",
      "#bd7f7b",
      "#3C50E0",
      "#375E83",
      "#259AE6",
      "#80CAEE",
      "#FFA70B",
      "#10B981",
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
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
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
      categories: [],
    },
    yaxis: {
      title: {
        text: "Purchases by months",
        style: {
          fontSize: "10px",
          color: "#2E3A47",
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
    },
  });
  const { totalSells } = SalesPurchases();

  const [totalBuyingPrice, setTotalBuyingPrice] = useState(0);

  useEffect(() => {
    if (allPurchase) {
      // Create an object to store quantities by product name and month
      const quantitiesByMonth: Record<string, Record<string, number>> = {};
      const averageBuyingPrice: Record<string, number> = {}; // Change to a flat structure
      const totalBuyingPriceByProduct: Record<string, number> = {};

      // Initialize an array to hold all unique product names
      const uniqueProductNames: string[] = [];

      allPurchase.forEach((purchase) => {
        purchase.products.forEach((product) => {
          const productName = product.productName;
          const quantity = product.recvQty + product.newRecvQty;

          // Check if either recvQty or newRecvQty is greater than 0
          if (quantity > 0) {
            const totalCost = product.buyingPrice * quantity;

            // Update the total buying price for this product
            if (!totalBuyingPriceByProduct[productName]) {
              totalBuyingPriceByProduct[productName] = totalCost;
            } else {
              totalBuyingPriceByProduct[productName] += totalCost;
            }

            // Add the product name to the uniqueProductNames array if it's not already present
            if (!uniqueProductNames.includes(productName)) {
              uniqueProductNames.push(productName);
            }
          }
        });
      });
      // Now, totalBuyingPriceByProduct contains the total buying price for each product

      // Calculate the total buying price across all products
      let totalBuyingPrice = 0;
      Object.keys(totalBuyingPriceByProduct).forEach((productName) => {
        totalBuyingPrice += totalBuyingPriceByProduct[productName];
      });

      // Set the total buying price in your component state
      setTotalBuyingPrice(totalBuyingPrice);

      // Extract unique months from your data
      const uniqueMonths: string[] = [];

      allPurchase.forEach((purchase) => {
        const dateCreated = new Date(purchase.date_created);
        const purchaseMonth = dateCreated.toLocaleDateString("en-US", {
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
          // Initialize the quantity for the product in the specific month
          if (!quantitiesByMonth[purchaseMonth][productName]) {
            quantitiesByMonth[purchaseMonth][productName] = 0;
          }
          // Update the quantity for the product in the specific month
          quantitiesByMonth[purchaseMonth][productName] += quantity;
          // Calculate the average buying price
          if (!averageBuyingPrice[productName]) {
            averageBuyingPrice[productName] = product.buyingPrice;
          } else {
            // Update the average buying price by averaging with the new buying price
            averageBuyingPrice[productName] =
              (averageBuyingPrice[productName] + product.buyingPrice) / 2;
          }
        });
      });
      // Sort the uniqueMonths array to ensure the correct sequence
      uniqueMonths.sort((a, b) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return months.indexOf(a) - months.indexOf(b);
      });

      // Create series data based on quantitiesByMonth
      const seriesData = uniqueMonths.map((month) => {
        const data = uniqueProductNames.map((productName) => ({
          x: productName,
          y: quantitiesByMonth[month]?.[productName] || 0, // Use 0 if data is missing
        }));

        return {
          name: month,
          data,
        };
      });

      setChartOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          categories: uniqueProductNames,
        },
        series: seriesData,
      }));
    }
  }, [allPurchase]);

  const revenue = totalBuyingPrice - totalSells;

  // NextJS Requirement
  const isWindowAvailable = () => typeof window !== "undefined";
  if (!isWindowAvailable()) return <></>;
  const isDataAvailable = allPurchase.length > 0;

  // const handleReset = () => {
  //   setChartOptions((prevState) => ({
  //     ...prevState,
  //   }));
  // };

  // handleReset;
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-2 sm:gap-5 mb-2">
          <div className="flex min-w-47.5 ">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Purchases</p>
              <p className="text-sm font-medium">₹{totalBuyingPrice}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">₹{totalSells}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Revenue</p>

              <p
                className={`text-sm font-medium ${
                  revenue <= 0 ? "text-success" : "text-danger"
                }`}
              >
                {revenue <= 0
                  ? `+ ₹${Math.abs(revenue)}`
                  : `- ₹${Math.abs(revenue)}`}
              </p>
            </div>
          </div>
        </div>
        {/* <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
               Month
            </button>
          </div>
        </div> */}
      </div>
      <>
        {isDataAvailable ? (
          <div id="chartOne" className="-ml-5 h-[355px] w-[103%] bg-secondary">
            <ReactApexChart
              options={chartOptions}
              series={chartOptions.series}
              type="area"
              height="100%"
              width="100%"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-gray-500 p-10">No data available</p>
          </div>
        )}
      </>
    </div>
  );
};

export default ChartOne;
