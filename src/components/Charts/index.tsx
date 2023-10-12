import React from "react";
import ChartOne from "@/components/Charts/ChartOne";
import ChartVendor from "@/components/Charts/ChartVendors";
import ChartCustomers from "@/components/Charts/ChartCustomers";
import TopSellingItems from "@/components/Charts/topSellingChart";
import PurchaseOrder from "@/app/commonApi/purchaseApi";

const Charts = () => {
  const { allPurchase } = PurchaseOrder();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center mb-6 shadow-sm shadow-warning py-2 px-1">
        <div className="w-full  ">
          <ChartCustomers />
        </div>
        <div className="w-full  ">
          <ChartVendor />
        </div>
        <div className="w-full  ">
          <TopSellingItems />
        </div>
      </div>
      <ChartOne allPurchase={allPurchase} />
    </>
  );
};

export default Charts;
