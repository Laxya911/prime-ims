"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FirstSec from "@/components/FirstSection/FirstSection";
import SecondSection from "@/components/SecondSection/SecondSecion";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartCustomers from '@/components/Charts/ChartCustomers';
import PurchaseOrder from "@/app/commonApi/purchaseApi";
import TopSellingItems from "@/components/Charts/topSellingChart";
const Dashboard = () => {
  const { allPurchase } = PurchaseOrder();
  return (
    <>
      <Breadcrumb pageName="" />
      <FirstSec />
      <SecondSection />
      <div className="flex justify-between mb-2">
        <div className="w-full">

      <ChartCustomers/>
        </div>
        <div className="w-full">

      <ChartThree />
        </div>
        <div className="w-full">

      <TopSellingItems />
        </div>
      </div>
      <ChartOne allPurchase={allPurchase} />

    </>
  );
};

export default Dashboard;
