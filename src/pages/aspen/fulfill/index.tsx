import { api } from "@/utils/api";
import type { NextPage } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrdoroOrder } from "@/types/ordoro";

import type { AspenOutput } from "@/utils/api";

type CardProps = {
  orderNumber: string;
  orderContents: string;
  orderPrice: string;
  officeName: string;
  madeBy: string;
  handler?: () => void | Promise<void> | Promise<unknown>;
};
{
  /* <Card key={order.id}>
  <CardHeader>
    <CardTitle>{orderNumber}</CardTitle>
    <CardDescription>{madeBy}</CardDescription>
    <CardDescription>For: {officeName}</CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="flex flex-col">{orderContents}</ul>
    <p>{orderPrice}</p>
  </CardContent>
</Card>; */
}

const FulfillPage = () => {
  const { data, isLoading, refetch } = api.aspenOrder.getOrders.useQuery();
  console.log("data", data);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {data?.map((order) => {
        return <Orders key={order.id} {...order} />;
      })}
    </div>
  );
};

const Orders = ({ ...order }) => {
  const { id, lines } = order;
  console.log(lines); // const handleCreateOrder = async () => {
  //   const req = await fetch("/api/ordoro/aspen/createAspenOrder", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify({
  //       orderNumber: order.,
  //       orderContents: order.orderContents,
  //     }),
  //   });

  //   const res = (await req.json()) as unknown;

  //   if (!res) {
  //     throw new Error("No response");
  //   }
  //   // refetch().catch(console.error);

  //   return data;
  // };

  return (
    <main>
      <h1>Fulfill Aspen</h1>
      <section className="m-auto flex flex-row items-center justify-center gap-3">
        {/* TODO: Check styling here */}
        {/* {order} */}
      </section>
    </main>
  );
};

export default FulfillPage;
