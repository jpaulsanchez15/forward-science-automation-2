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
import Head from "next/head";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

type OrdoroLabel = {
  data: OrdoroLabelResponseType;
  message: string;
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
          {props.ordoroLink !== "" && props.completed ? (
            <CardDescription className="font-bold text-green-400 underline  hover:cursor-pointer hover:text-green-600">
              <Link
                target="_blank"
                className="visited:text-gray-400 visited:hover:text-gray-600"
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
          <ul className="m-auto mb-4 flex w-full flex-col items-center justify-center text-center">
            {props.orderContents}
          </ul>
          <p className="flex flex-col text-center">
            Total: ${props.orderPrice}
          </p>
        </CardContent>
        {!props.completed ? (
          <div className="m-auto mb-4 flex flex-col items-center justify-center">
            <Button
              disabled={props.disabled}
              className={
                props.buttonText === "1. Create Order"
                  ? `bg-black hover:bg-gray-400 dark:bg-white dark:hover:bg-gray-400`
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
  const [disabled, isDisabled] = useState(false);

  const { data: session } = useSession();

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
    <>
      <Head>
        <title>Forward Science Automation | Fulfill Aspen</title>
      </Head>
      <main className="m-auto flex min-h-screen  flex-col items-center justify-center">
        <h1 className="mb-6 text-center text-4xl font-bold">Fulfill Aspen</h1>
        <div
          className={
            data.length > 0
              ? `mx-4 my-3 grid  grid-cols-5 items-center justify-center gap-2`
              : `mx-auto flex items-center justify-center text-center`
          }
        >
          {data.length > 0 ? (
            data
              ?.sort((a, b) =>
                a.createdAt > b.createdAt
                  ? -1
                  : b.createdAt > a.createdAt
                  ? 1
                  : 0
              )
              .filter((order) => order.createdBy == session?.user?.name)
              .map((order) => {
                return (
                  <Orders
                    key={order.id}
                    order={order}
                    refetch={refetch}
                    disabled={disabled}
                    isDisabled={isDisabled}
                  />
                );
              })
          ) : (
            <div>
              <span className="font-light italic text-gray-400">
                No orders to fulfill!
              </span>
              <div>
                <div className="max-w-2xlpy-32 mx-auto sm:py-48 lg:py-32">
                  <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                    <div className="hover:bg-vanilla relative rounded-full bg-white px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:bg-gray-400 hover:ring-gray-900/20 dark:bg-white dark:text-black dark:hover:bg-gray-400">
                      Need to create more orders?{" "}
                      <Link href="/aspen/create" className="font-semibold">
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
    </>
  );
};

const Orders = ({
  order,
  refetch,
  disabled,
  isDisabled,
}: {
  order: GetOrdersType;
  // TODO: Type this any
  refetch: () => Promise<any>;
  disabled: boolean;
  isDisabled: (disabled: boolean) => void;
}) => {
  const [handleLoading, setHandleLoading] = useState(false);
  const { toast } = useToast();
  const deletedOrder = api.aspenOrder.deleteOrder.useMutation({
    onSuccess: () => {
      toast({
        description:
          "Order deleted! Please ensure you delete the items in Ordoro and Sugar if you made it that far.",
        variant: "success",
      });
      refetch().catch(console.error);
    },
    onError: () => {
      toast({ description: "Error deleting order!", variant: "destructive" });
    },
  });

  const fileAwayOrder = api.aspenOrder.completeOrder.useMutation({
    onSuccess: () => {
      toast({ description: "Order filed away!", variant: "success" });
      refetch().catch(console.error);
    },
    onError: () => {
      toast({
        description: "Error filing away order!",
        variant: "destructive",
      });
    },
  });

  const handleCreateOrder = async () => {
    isDisabled(true);
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
      toast({
        description: `PO-${order.orderNumber ?? "Unknown PO Number"} created!`,
        variant: "success",
      });
      refetch().catch(console.error);
      return data;
    } catch (error) {
      toast({
        description: "Error creating order! Try again in a few seconds.",
        variant: "destructive",
      });
      setHandleLoading(false);
      return;
    } finally {
      setHandleLoading(false);
      isDisabled(false);
    }
  };

  const handleCreateLabel = async () => {
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

      if (labelCreated.status === 404) {
        throw new Error(
          "Please try again in a few seconds. Ordoro hasn't recognized this has been created."
        );
      }

      const labelCreatedResponse = (await labelCreated.json()) as OrdoroLabel;

      if (
        labelCreatedResponse.message ==
        "Error 3050: Invalid Recipient Postal Code Format"
      )
        throw new Error(
          "Zip code is incorrect. Please go to the order in Ordoro and fix it, then go to Sugar and fix the zip code."
        );

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
        { name: "FS-760", value: shipLogItemsMap[6]?.value },
        { name: "FS-03", value: shipLogItemsMap[7]?.value },
        { name: "FS-701", value: shipLogItemsMap[8]?.value },
      ];

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
          name: labelCreatedResponse.data?.tracking_number,
          order_no: order.orderNumber,
          product_sales_total_c:
            order.lines.reduce((acc, line) => acc + Number(line.price), 0) ?? 0,
          date_ordered_c: order.createdAt?.toISOString(),
        }),
      });
      await shipLog.json();
      toast({
        variant: "success",
        description: `PO-${
          order.orderNumber ?? "Unknown PO Number"
        }'s label created!`,
      });
      return labelCreatedResponse;
    } catch (error) {
      if (error instanceof Error)
        toast({ description: error.message, variant: "destructive" });
      setHandleLoading(false);
      return;
    } finally {
      setHandleLoading(false);
      refetch().catch(console.error);
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
        order.lines.reduce((acc, line) => acc + Number(line.price), 0) ?? 0
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
      disabled={handleLoading || disabled}
      deleteHandler={handleDeleteOrder}
      processing={handleLoading}
      fileAwayHandler={handleFileAwayOrder}
    />
  );
};

export default FulfillPage;
