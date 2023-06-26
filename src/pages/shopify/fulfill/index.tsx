import type { OrdoroOrder } from "@/types/ordoro";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type CardProps = {
  orderNumber: string;
};

export const getServerSideProps = async () => {
  const res = await fetch(
    "https://forward-science-automation.vercel.app/api/ordoro/shopify/getUnfullfiledOrders"
  );
  const data = (await res.json()) as OrdoroOrder[];

  return {
    props: {
      shopifyOrders: data,
    },
  };
};

const Cards = ({ ...props }: CardProps) => {
  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Order: {props.orderNumber}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Card Description</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

const FulfillPage = ({ shopifyOrders }: { shopifyOrders: OrdoroOrder[] }) => {
  return (
    <main className="m-auto flex h-screen min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-center text-4xl font-bold">Fulfill Shopify</h1>
      <div className="mx-auto my-3 flex flex-row items-center justify-center gap-3">
        <div>
          {shopifyOrders.length > 0 ? (
            shopifyOrders.map((order) => {
              return <Orders key={order.order_number} order={order} />;
            })
          ) : (
            <div>
              <span className="mx-auto flex items-center justify-center text-center font-light italic text-gray-400">
                No orders to fulfill!
              </span>
              <div>
                <div className="max-w-2xlpy-32 mx-auto sm:py-48 lg:py-32">
                  <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="hover:bg-vanilla relative rounded-full bg-white px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:bg-gray-400 hover:ring-gray-900/20 dark:bg-white dark:text-black dark:hover:bg-gray-400">
                      Need to create more orders?{" "}
                      <Link
                        href="/aspen/create"
                        className="text-coral-pink font-semibold"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default FulfillPage;

const Orders = ({ order }: { order: OrdoroOrder }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-center">
        <Cards
          orderNumber={
            order.order_number?.slice(2) ?? "Couldn't find Order Number"
          }
        />
      </div>
    </div>
  );
};
