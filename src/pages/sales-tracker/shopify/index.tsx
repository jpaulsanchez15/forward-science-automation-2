import Head from "next/head";
import { ShopifyOrder, columns } from "../../../components/shopify/columns";
import { DataTable } from "../../../components/shopify/dataTable";
import { env } from "@/env.mjs";

type TrackerItem = {
  id: string;
  link: string;
  date: Date;
  orderNumber: string;
  product: string;
  quantity: number;
  amount: number;
  ambassador: string;
  commission: number;
};

export const getStaticProps = async () => {
  const res = await fetch(
    "https://forward-science-automation.vercel.app/api/shopify/getCommission"
  );
  const data = await res.json();

  return {
    props: {
      data,
    },
    revalidate: 60,
  };
};

const SalesTracker = ({ data }: any) => {
  const tracker: TrackerItem[] = data.orders.flatMap((order: any) => {
    const tagCheck = order.tags.includes("FS_Ambassador") ?? false;
    const connerCheck = order.customer.email === "cdeeds@forwardscience.com";
    const ambassadorCheck = tagCheck && !connerCheck;
    return order.line_items
      .filter((line: any) => line.quantity > 0)
      .map((line: any, index: any) => ({
        id: String(index + 1),
        link: `${env.NEXT_PUBLIC_SHOPIFY_STORE_URL}/${order.id}`,
        date: order.created_at.slice(0, 10) as unknown as Date,
        orderNumber: order.order_number,
        product: line.name,
        quantity: line.quantity,
        amount: +line.price * line.quantity,
        ambassador: ambassadorCheck ? "Yes" : "No",
        commission: +line.price * line.quantity * 0.15,
      }));
  });

  return (
    <div>
      <Head>
        <title>Forward Science Automation | Shopify - Sales Tracker</title>
      </Head>
      <div className="container mx-auto py-10">
        {/* @ts-ignore */}
        <DataTable columns={columns} data={tracker} csvData={tracker} />
      </div>
    </div>
  );
};

export default SalesTracker;
