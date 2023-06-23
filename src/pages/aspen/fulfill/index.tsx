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

type CardProps = {
  orderNumber: string;
  orderContents: string;
  orderPrice: string;
  madeBy: string;
  handler?: () => void;
};

const OrderCard = ({
  orderNumber,
  orderContents,
  orderPrice,
  madeBy,
  handler,
}: CardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{orderNumber}</CardTitle>
        <CardDescription>{madeBy}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col">{orderContents}</ul>
        <p>{orderPrice}</p>
      </CardContent>
      <CardContent>
        <Button onClick={handler}>Create Order</Button>
      </CardContent>
    </Card>
  );
};

const FulfillAspen: NextPage = () => {
  const { data, isLoading, refetch } = api.aspenOrder.getOrders.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCreateOrder = async () => {
    const req = await fetch("/api/ordoro/aspen/createAspenOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        data?.map((order) => {
          order.orderNumber,
            order.officeName,
            order.lines.map((line) => line.price);
        })
      ),
    });
    const res = (await req.json()) as unknown;

    if (!res) {
      throw new Error("No response");
    }

    refetch().catch(console.error);
    // await getOrders();

    return data;
  };

  return (
    <main>
      <h1>Fulfill Aspen</h1>
      <section className="m-auto flex flex-row items-center justify-center gap-3">
        {/* TODO: Check styling here */}
        {data?.map((order) => (
          <OrderCard
            key={order.orderNumber}
            orderNumber={`Order Number: ${order.orderNumber}`}
            orderContents={order.lines
              .filter((line) => line.quantity > 0)
              .map((line) => `${line.quantity} x ${line.productName}`)
              .join("\n")}
            orderPrice={order.lines.map((line) => line.price).join("\n")}
            madeBy={order.createdBy as string}
            handler={() => {
              console.log("Create Order");
            }}
          />
        ))}
      </section>
    </main>
  );
};

export default FulfillAspen;
