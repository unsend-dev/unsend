"use client";

import DashboardChart from "./dashboard-chart";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <div className="mx-auto flex justify-center item-center mt-[30vh]">
        <DashboardChart />
      </div>
    </div>
  );
}
