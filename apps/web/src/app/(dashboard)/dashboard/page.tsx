"use client";

import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "@unsend/ui/src/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@unsend/ui/src/dropdown-menu";
import { Input } from "@unsend/ui/src/input";
import { Sheet, SheetContent, SheetTrigger } from "@unsend/ui/src/sheet";
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
