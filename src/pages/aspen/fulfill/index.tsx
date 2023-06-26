import { Check, Loader2, X } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AspenFulfillCardProps } from "@/types/aspen";
import type { OrdoroLabelResponseType, OrdoroOrder } from "@/types/ordoro";
import type { SugarOffice } from "@/types/sugar";
import type { GetOrdersType } from "@/types/trpc";
import { api } from "@/utils/api";
import { formatAspenOrder } from "@/utils/ordoro";
import toast from "react-hot-toast";

type OrdoroLabel = {
  data: OrdoroLabelResponseType;
};

const Cards = ({ ...props }: AspenFulfillCardProps) => {
  return (
    <div className="h-full">
      <Card className="h-full">
        <X
          className="right-0 top-0 flex hover:cursor-pointer hover:rounded-sm hover:bg-gray-400"
          type="button"
          onClick={props.deleteHandler}
        />
        <CardHeader>
          <CardTitle>Order Number: {props.orderNumber}</CardTitle>
          <CardDescription>{props.madeBy}</CardDescription>
          <CardDescription>For: {props.officeName}</CardDescription>
          {props.ordoroLink !== "" ? (
            <CardDescription className="font-bold text-green-400 underline hover:cursor-pointer hover:text-green-600">
              <Link
                target="_blank"
                href={`https://abode.ordoro.com/label?$order=${
                  props.ordoroLink?.slice(7) ?? ""
                }&docs=shippinglabel&layout=thermal&utcOffset=-360&template=51196&showLogoOnLabel=true`}
              >
                Ordoro Link
              </Link>
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col">{props.orderContents}</ul>
          <p>Total: ${props.orderPrice}</p>
        </CardContent>
        {!props.completed ? (
          <div className="m-auto mb-4 flex flex-col items-center justify-center">
            <Button
              disabled={props.disabled}
              className={
                props.buttonText === "1. Create Order"
                  ? `bg-white hover:bg-gray-400`
                  : `bg-green-400 hover:bg-green-500`
              }
              onClick={props.handler}
            >
              {props.buttonText}
            </Button>
          </div>
        ) : (
          <div className="m-auto flex flex-col items-center justify-center">
            <Check
              className="hover:cursor-pointer"
              onClick={props.fileAwayHandler}
              size="30px"
              color="rgb(74 222 128)"
            />
          </div>
        )}
        {props.processing ? (
          <div className="flex flex-col">
            <Loader2 className="m-auto animate-spin" size="30px" />
          </div>
        ) : null}
      </Card>
    </div>
  );
};

const FulfillPage: NextPage = () => {
  const { data, isLoading, refetch } = api.aspenOrder.getOrders.useQuery();

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

  return (
    <main className="m-auto flex h-screen min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-center text-4xl font-bold">Fulfill Aspen</h1>
      <div className="mx-auto my-3 flex flex-row items-center justify-center gap-3">
        {data.length > 0 ? (
          data?.map((order) => {
            return <Orders key={order.id} order={order} refetch={refetch} />;
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
    </main>
  );
};

const Orders = ({
  order,
  refetch,
}: {
  order: GetOrdersType;
  // TODO: Type this any
  refetch: () => Promise<any>;
}) => {
  const [handleLoading, setHandleLoading] = useState(false);
  const deletedOrder = api.aspenOrder.deleteOrder.useMutation({
    onSuccess: () => {
      toast.success("Order deleted!");
      refetch().catch(console.error);
    },
    onError: () => {
      toast.error("Error deleting order!");
    },
  });

  const fileAwayOrder = api.aspenOrder.completeOrder.useMutation({
    onSuccess: () => {
      toast.success("Order filed away!");
      refetch().catch(console.error);
    },
    onError: () => {
      toast.error("Error filing away order!");
    },
  });

  const handleCreateOrder = async () => {
    setHandleLoading(true);
    try {
      const res = await fetch("/api/ordoro/aspen/createAspenOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          orderContents: order.lines,
        }),
      });

      const data = (await res.json()) as OrdoroOrder;
      toast.success(`PO-${order.orderNumber ?? "Unknown PO Number"} created!`);
      refetch().catch(console.error);
      return data;
    } catch (error) {
      toast.error("Error creating order! Try again in a few seconds.");
      setHandleLoading(false);
      return;
    } finally {
      setHandleLoading(false);
      console.log("done creating order");
    }
  };

  const handleCreateLabel = async () => {
    console.log("Creating label...");
    setHandleLoading(true);

    try {
      const label = await formatAspenOrder(order.lines);

      const sugarOffice = await fetch(
        `/api/sugar/aspen/findAspenOffice?officeName=${order.officeName ?? ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const sugarOfficeResponse = (await sugarOffice.json()) as SugarOffice[];

      const officeId = sugarOfficeResponse[0]?.id;

      const labelCreated = await fetch("/api/ordoro/aspen/createAspenLabel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num: order.ordoroLink,
          lines: label,
        }),
      });

      const labelCreatedResponse = (await labelCreated.json()) as OrdoroLabel;

      const shipLogItemsMap = order.lines.map((line) => {
        return {
          name: line.productName,
          value: line.quantity,
        };
      });

      const shipLogItems = [
        // TODO: Kinda cringe but needs to work for now I guess.
        { name: "TheraStom 12 pk", value: shipLogItemsMap[0]?.value },
        { name: "OxiStom 6 pk", value: shipLogItemsMap[1]?.value },
        { name: "SalivaMAX 10 pk", value: shipLogItemsMap[2]?.value },
        {
          name: "Space Grey OID Kit \n Follow BOM",
          value: shipLogItemsMap[3]?.value,
        },
        { name: "FS-88", value: shipLogItemsMap[4]?.value },
        { name: "FS-84", value: shipLogItemsMap[5]?.value },
      ];

      if (labelCreatedResponse?.data.message === "Order not found") {
        setHandleLoading(false);
        return alert(
          "The order hasn't been created in Ordoro yet. Please wait a couple of seconds to try again!"
        );
      } else if (
        labelCreatedResponse?.data.message === "Error creating label"
      ) {
        setHandleLoading(false);
        return alert(
          "Order timed out. There was an error completing the order. I think I still made the label, but just check the order in Ordoro and Sugar just to make sure."
        );
      } else {
        const listItemString = shipLogItems
          .filter((item) => item?.value ?? 0 > 0)
          .map((item) => {
            return `${item.value ?? 0} x ${item.name}`;
          })
          .join("\n");

        const shipLog = await fetch("/api/sugar/aspen/createShipLog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            office: officeId,
            description: listItemString,
            name: labelCreatedResponse.data.tracking_number,
            order_no: order.orderNumber,
            product_sales_total_c:
              order.lines
                .reduce(
                  (acc, line) =>
                    acc + Number(line.quantity) * Number(line.price),
                  0
                )
                .toFixed(2) ?? null,
          }),
        });
        const shipLogResponse = (await shipLog.json()) as unknown;
        return shipLogResponse;
      }
    } catch (error) {
      toast.error("Error creating label!");
      setHandleLoading(false);
      return;
    } finally {
      toast.success(
        `PO-${order.orderNumber ?? "Unknown PO Number"}'s label created!`
      );
      setHandleLoading(false);
      refetch().catch(console.error);
      console.log("done ceating label");
      return;
    }
  };

  const handleDeleteOrder = () => {
    deletedOrder.mutate({
      orderNumber: order.orderNumber ?? "",
    });
  };

  const handleFileAwayOrder = () => {
    fileAwayOrder.mutate({
      id: order.id ?? "",
      fileAway: true,
    });
  };

  return (
    <Cards
      orderNumber={order.orderNumber}
      orderContents={order.lines
        .filter((line) => line.quantity > 0)
        .map((line) => {
          return (
            <li key={line.id}>
              {line.quantity} x {line.productName}
            </li>
          );
        })}
      orderPrice={
        order.lines
          .reduce(
            (acc, line) => acc + Number(line.quantity) * Number(line.price),
            0
          )
          .toFixed(2) ?? null
      }
      officeName={order.officeName}
      madeBy={order.createdBy}
      handler={
        order.trackingNumber === "" && order.ordoroLink !== ""
          ? handleCreateLabel
          : handleCreateOrder
      }
      buttonText={
        order.ordoroLink !== "" ? "2. Process Order" : "1. Create Order"
      }
      completed={order.trackingNumber !== ""}
      ordoroLink={order.ordoroLink}
      disabled={handleLoading}
      deleteHandler={handleDeleteOrder}
      processing={handleLoading}
      fileAwayHandler={handleFileAwayOrder}
    />
  );
};

export default FulfillPage;
