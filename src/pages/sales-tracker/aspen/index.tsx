import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";

import { AspenOrder, columns } from "../../../components/aspen/columns";
import { DataTable } from "../../../components/aspen/dataTable";

type TrackerItem = {
  id: string;
  date: Date;
  orderNumber: string;
  product: string;
  quantity: number;
  amount: number;
};

const SalesTracker = () => {
  const { data, isLoading, refetch } = api.aspenOrder.getCompleted.useQuery();

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
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={tracker} />
      </div>
    </div>
  );
};

export default SalesTracker;
