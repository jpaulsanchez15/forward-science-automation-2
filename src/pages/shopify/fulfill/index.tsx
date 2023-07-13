import type { OrdoroLabelResponseType, OrdoroOrder } from "@/types/ordoro";
import { formatShopifyOrder } from "@/utils/ordoro";
import { AlertTriangle, Info, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ShopifyResponseType } from "@/types/shopify";
import Link from "next/link";
import Modal from "@/components/modal";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SugarOffice } from "@/types/sugar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Head from "next/head";

type CardProps = {
  orderNumber: string;
  orderContents?: any;
  shopifyLink?: number;
  ambassador?: boolean;
  npi?: boolean;
  price?: number;
  processing?: boolean;
  buttonText?: string;
  complete?: boolean;
  fulfillHandler?: () => void | Promise<void> | Promise<unknown>;
  addToSugarHandler?: () => void | Promise<void> | Promise<unknown>;
};

const Tooltips = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Cards = ({ ...props }: CardProps) => {
  return (
    <div className="h-full">
      <Card className="h-full w-full">
        <CardHeader>
          <div className="flex flex-row gap-3">
            <Tooltips text="This is an FS Ambassador order!">
              {props.ambassador && <Info />}
            </Tooltips>
            <Tooltips text="No NPI Detected! Please ensure they are a medical professional.">
              {props.npi ? null : <AlertTriangle />}
            </Tooltips>
          </div>

          <CardTitle>
            <Link
              target="_blank"
              className="hover:underline"
              href={`https://abode.ordoro.com/label?$order=1-${
                props.orderNumber ?? ""
              }&docs=shippinglabel&layout=thermal&utcOffset=-360&template=51196&showLogoOnLabel=true`}
            >
              Order: {props.orderNumber}
            </Link>
          </CardTitle>
          <CardDescription>
            <Link
              target="_blank"
              className="hover:underline"
              href={`https://oralid.myshopify.com/admin/orders/${
                props.shopifyLink ?? ""
              }`}
            >
              Shopify Link
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul>{props.orderContents}</ul>
          <p>Price: ${props.price}</p>
        </CardContent>
        {!props.processing ? (
          <Button
            className={`m-auto mb-4 flex flex-col items-center justify-center ${
              !props.processing && props.complete ? "hidden" : ""
            }`}
            onClick={
              props.buttonText === "Create Label"
                ? props.fulfillHandler
                : props.addToSugarHandler
            }
          >
            {props.buttonText}
          </Button>
        ) : null}
        {props.processing ? (
          <div className="flex flex-col">
            <Loader2 className="m-auto animate-spin" size="30px" />
          </div>
        ) : null}
        {props.complete ? (
          <div className="m-auto flex flex-col items-center justify-center">
            <Check size="30px" color="rgb(74 222 128)" />
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export const getServerSideProps = async () => {
  const ordoroShopifyOrdersRes = await fetch(
    "http://forward-science-automation.vercel.app/api/ordoro/shopify/getUnfulfilledOrders"
  );
  const ordoroShopifyOrdersData =
    (await ordoroShopifyOrdersRes.json()) as OrdoroOrder[];

  const shopifyOrderRes = await fetch(
    "http://forward-science-automation.vercel.app/api/shopify"
  );

  const shopifyOrderData =
    (await shopifyOrderRes.json()) as ShopifyResponseType[];

  return {
    props: {
      ordoroShopifyOrders: ordoroShopifyOrdersData,
      shopifyOrders: shopifyOrderData,
    },
  };
};

const FulfillPage = ({
  ordoroShopifyOrders,
  shopifyOrders,
}: {
  ordoroShopifyOrders: OrdoroOrder[];
  shopifyOrders: ShopifyResponseType[];
}) => {
  return (
    <>
      <Head>
        <title>Forward Science Automation | Fulfill Shopify Orders</title>
      </Head>
      <main className="m-auto flex h-screen min-h-screen flex-col items-center justify-center">
        <h1 className="mb-6 text-center text-4xl font-bold">Fulfill Shopify</h1>
        <div className="mx-auto my-3 flex flex-row items-center justify-center gap-3">
          {ordoroShopifyOrders.length > 0 ? (
            ordoroShopifyOrders.map((order) => {
              const matchingShopifyOrder = shopifyOrders.find(
                (shopifyOrder) =>
                  (shopifyOrder.order_number as unknown as string) ==
                  order?.order_number?.slice(2)
              );
              return (
                <Orders
                  key={order.order_number}
                  order={order}
                  shopify={
                    matchingShopifyOrder ??
                    ([] as unknown as ShopifyResponseType)
                  }
                />
              );
            })
          ) : (
            <div>
              <span className="mx-auto flex items-center justify-center text-center font-light italic text-gray-400">
                No orders to fulfill!
              </span>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default FulfillPage;

type OrderContents = {
  sku: string;
  quantity: number;
};

const Orders = ({
  order,
  shopify,
}: {
  order: OrdoroOrder;
  shopify: ShopifyResponseType;
}) => {
  // TODO: Get rid of this dogshit
  const [processing, isProcessing] = useState(false);
  const [complete, isComplete] = useState(false);
  const [tracking, setTracking] = useState("");
  const [offices, setOffices] = useState<SugarOffice[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const ambassador = shopify.tags?.includes("FS_Ambassador") ?? false;
  const { note } = shopify.customer ?? "";
  const npi = /\d/.test(note ?? "");

  const { toast } = useToast();

  const createLabel = async () => {
    try {
      isProcessing(true);
      const lines = formatShopifyOrder(
        order.lines?.map(
          (line) =>
            ({
              sku: line.sku,
              quantity: line.quantity,
            } as OrderContents)
        ) ?? []
      );

      const payload = {
        num: order.order_number,
        lines: lines,
        order: order.lines,
        ambassador: ambassador,
        npi: npi,
      };

      const res = await fetch("/api/ordoro/shopify/createShopifyLabel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as OrdoroLabelResponseType;

      toast({ description: "Successfully created label!", variant: "success" });
      setTracking(data.tracking_number);
      return data;
    } catch (err) {
      isProcessing(false);
      toast({
        description: "Something went wrong making the label...",
        variant: "destructive",
      });
    } finally {
      isProcessing(false);
    }
  };

  const handleRetrieveSugarOfficeClick = async () => {
    isProcessing(true);
    const { company, address1: address, phone } = shopify.shipping_address;

    const formattedPhone = phone?.replace(/\D/g, "");
    const formattedPhoneTwo = formattedPhone?.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );

    try {
      const res = await fetch(
        `/api/sugar/shopify/findShopifyOffice?officeName=${
          company ?? ""
        }&phone=${formattedPhoneTwo}&address=${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = (await res.json()) as SugarOffice[];

      if (data.length > 0) {
        setOffices(data);
        setShowModal(true);
      } else {
        setOffices([]);
        toast({ description: "No offices found!", variant: "destructive" });
        isProcessing(false);
        setShowModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      isProcessing(false);
    }

    return;
  };

  const handleAddToSugarClick = async (id: string) => {
    try {
      offices.length = 0;
      isProcessing(true);

      const productDescription = order
        ?.lines!.map((item) => {
          return `${item?.quantity ?? 0} x ${item?.product_name ?? ""}`;
        })
        .join("\n");

      const price = shopify.total_price;

      const res = await fetch("/api/sugar/shopify/createShipLog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          office: id,
          description: productDescription,
          name: tracking.toString(),
          order_no: order.order_number?.slice(2),
          product_sales_total_c: price.toString(),
          ambassador,
        }),
      });

      const data = (await res.json()) as unknown;

      toast({
        description: "Successfully added to SugarCRM",
        variant: "success",
      });
      isComplete(true);

      return data;
    } catch (err) {
      toast({
        description: "Error adding to SugarCRM",
        variant: "destructive",
      });
      isProcessing(false);
    } finally {
      isProcessing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-center justify-center">
          <Cards
            orderNumber={
              order.order_number?.slice(2) ?? "Couldn't find Order Number"
            }
            ambassador={ambassador}
            npi={npi}
            orderContents={order.lines?.map((line) => (
              <li className="mx-2" key={line.link}>
                {line.quantity ?? 0} x {line.product_name ?? ""}
              </li>
            ))}
            price={
              order.lines?.reduce((acc, line) => {
                return acc + (line.quantity ?? 0) * (line.item_price ?? 0);
              }, 0) ?? 0
            }
            shopifyLink={shopify.id}
            processing={processing}
            buttonText={
              !processing && tracking === "" ? "Create Label" : "Add to Sugar"
            }
            complete={!processing && complete && offices.length == 0}
            fulfillHandler={createLabel}
            addToSugarHandler={handleRetrieveSugarOfficeClick}
          />
        </div>
        <div>
          {offices.length >= 0 ? (
            <Modal
              isVisible={showModal}
              title={order.order_number ?? ""}
              offices={offices.map((office) => {
                return (
                  <div key={office.id} className="flex flex-col">
                    <button
                      onClick={() => setSelectedOffice(office.id)}
                      className="inline-flex items-center rounded-lg px-3 py-2 text-center text-sm font-medium hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    >
                      <ul className="ml-2 list-disc p-2 text-left">
                        <li key={office.name}>Office: {office.name}</li>
                        <li key={office.shipping_address_street}>
                          Address: {office.shipping_address_street}
                        </li>
                        <li key={office.phone_office}>
                          Phone: {office.phone_office}
                        </li>
                      </ul>
                    </button>
                  </div>
                );
              })}
              accept={() => {
                setShowModal(false);
                handleAddToSugarClick(selectedOffice).catch((err) =>
                  console.error(err)
                );
              }}
              close={() => setShowModal(false)}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};
