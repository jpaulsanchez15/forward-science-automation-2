import { api } from "@/utils/api";
import { CalendarIcon, Loader2 } from "lucide-react";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Form,
//   FormControl,
//   // FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";

// import { format, isValid } from "date-fns";

import { AspenOrder, columns } from "../../../components/aspen/columns";
import { DataTable } from "../../../components/aspen/dataTable";
import Head from "next/head";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { z } from "zod";
// import { cn } from "@/lib/utils";

type TrackerItem = {
  id: string;
  date: Date;
  orderNumber: string;
  product: string;
  quantity: number;
  amount: number;
};

const SalesTracker = () => {
  const { data, isLoading } = api.aspenOrder.getCompletedOrders.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loader2 className="animate-spin" size="60px" />
        <span className="m-0 font-light italic text-gray-400">
          Fetching orders...
        </span>
      </div>
    );
  }

  if (!data) {
    return <p>Error fetching orders!</p>;
  }

  const tracker: TrackerItem[] = data.flatMap((order) => {
    return order.lines
      .filter((line) => line.quantity > 0)
      .map((line, index) => ({
        id: String(index + 1),
        date: order.createdAt.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "2-digit",
        }) as unknown as Date,
        orderNumber: order.orderNumber,
        product: line.productName,
        quantity: line.quantity,
        amount: +line.price,
      }));
  });

  return (
    <div>
      <Head>
        <title>Forward Science Automation | Aspen - Sales Tracker</title>
      </Head>
      <div className="container mx-auto py-10">
        {/* <DateFilter setDate={() => {}} /> */}
        <DataTable columns={columns} data={tracker} csvData={tracker} />
      </div>
    </div>
  );
};

export default SalesTracker;
