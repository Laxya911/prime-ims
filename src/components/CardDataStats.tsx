import React, { ReactNode } from "react";
interface CardDataStatsProps {
  title: string;
  total: string;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  children,
}) => {
  return (
    <div className="rounded-lg border border-stroke bg-white py-2 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <>
        {children}
      </>
      <div className=" flex items-end justify-between">
        <div className="text-title-md font-bold gap-2 text-black dark:text-white">
          <h4  className="text-sm font-medium " >
          {title} {" "}{" "} &nbsp; {total}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
