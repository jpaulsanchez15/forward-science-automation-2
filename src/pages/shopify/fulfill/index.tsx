import type { OrdoroLabelResponseType, OrdoroOrder } from "@/types/ordoro";
import { formatShopifyOrder } from "@/utils/ordoro";
import { AlertTriangle, Info, Loader2 } from "lucide-react";

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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SugarOffice } from "@/types/sugar";
import { useState } from "react";

type CardProps = {
  orderNumber: string;
  orderContents?: string;
  shopifyLink?: number;
  ambassador?: boolean;
  npi?: boolean;
  price?: number;
  processing?: boolean;
  fulfillHandler?: () => void | Promise<void> | Promise<unknown>;
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
          <Tooltips text="This is an FS Ambassador order!">
            {props.ambassador && <Info className="right-0 top-0 flex" />}
          </Tooltips>
          <Tooltips text="No NPI Detected! Please ensure they are a medical professional.">
            {props.npi ? null : <AlertTriangle />}
          </Tooltips>
          <CardTitle>Order: {props.orderNumber}</CardTitle>
          <CardDescription>
            <Link
              target="_blank"
              href={`https://oralid.myshopify.com/admin/orders/${
                props.shopifyLink ?? ""
              }`}
            >
              Shopify Link
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{props.orderContents}</p>
          <p>Price: ${props.price}</p>
        </CardContent>
        <Button
          className="m-auto mb-4 flex flex-col items-center justify-center"
          onClick={props.fulfillHandler}
        >
          Fullfill
        </Button>
        {props.processing ? (
          <div className="flex flex-col">
            <Loader2 className="m-auto animate-spin" size="30px" />
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export const getServerSideProps = async () => {
  const ordoroShopifyOrdersRes = await fetch(
    "https://forward-science-automation.vercel.app/api/ordoro/shopify/getUnfullfiledOrders"
  );
  const ordoroShopifyOrdersData =
    (await ordoroShopifyOrdersRes.json()) as OrdoroOrder[];

  const shopifyOrderRes = await fetch("http://localhost:3000/api/shopify");

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
    <main className="m-auto flex h-screen min-h-screen flex-col items-center justify-center">
      <h1 className="mb-6 text-center text-4xl font-bold">Fulfill Shopify</h1>
      <div className="mx-auto my-3 flex flex-row items-center justify-center gap-3">
        <div>
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
                  shopify={matchingShopifyOrder!!}
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
      </div>
    </main>
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
  const [error, setError] = useState<string>("");

  const ambassador = shopify.tags?.includes("FS Ambassador");
  const { note } = shopify.customer;
  const npi = /\d/.test(note ?? "");

  const createLabel = async () => {
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
      num: order.order_number?.slice(2),
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

    setTracking(data.tracking_number);
    isProcessing(false);
    isComplete(true);

    return data;
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
      } else {
        setOffices([]);
        isProcessing(false);
        setShowModal(false);
        setError("No offices found");
      }
    } catch (err) {
      console.error(err);
    }

    isProcessing(false);
    return;
  };

  const handleAddToSugarClick = async (id: string) => {
    offices.length = 0;
    isProcessing(true);

    if (!order) {
      isProcessing(false);
      return;
    }

    const productDescription = order?.lines
      .map((item) => {
        return `${item?.quantity} x ${item?.product_name}`;
      })
      .join("\n");

    const price =
      shopify.total_price - shopify.total_tax - shopify.total_discounts;

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

    isProcessing(false);
    return data;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-center">
        <Cards
          orderNumber={
            order.order_number?.slice(2) ?? "Couldn't find Order Number"
          }
          ambassador={shopify.tags.includes("FS Ambassador")}
          npi={shopify.customer.note.includes("NPI")}
          orderContents={order.lines
            ?.map(
              (line) => `${line.quantity ?? 0} x ${line.product_name ?? ""}`
            )
            .join(",")}
          price={
            order.lines?.reduce((acc, line) => {
              return acc + (line.quantity ?? 0) * (line.item_price ?? 0);
            }, 0) ?? 0
          }
          shopifyLink={shopify.id}
        />
      </div>
    </div>
  );
};
