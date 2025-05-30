import Head from "next/head";

import { Cards } from "@/components/cards";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const cardInfo = [
  // {
  //   title: "Shopify",
  //   description: "Fulfill an existing Shopify order",
  // },
  {
    title: "Aspen",
    description: "Automate Aspen Orders",
  },
  {
    title: "Sage",
    description: "Automate Sage Orders",
  },
  {
    title: "FAQ",
    description: "Frequently Asked Questions",
  },
];

const CardsList = () => {
  return (
    <div className="mx-auto flex flex-row items-center justify-center gap-4">
      {cardInfo.map((card) => {
        return (
          <Link key={card.title} href={`/${card.title.toLowerCase()}`}>
            <Cards
              key={card.title}
              title={card.title}
              description={card.description}
            />
          </Link>
        );
      })}
    </div>
  );
};

const Home = () => {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated: () => {
      router.push("/api/auth/signin");
    },
  });

  return (
    <>
      <Head>
        <title>Forward Science Automation | Home</title>
        <meta name="description" content="Forward Science Automation tool." />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <h1 className="mb-12 border-b-2  text-4xl font-bold">
          Forward Science Automation
        </h1>

        <CardsList />
        <section className="mb-12 mt-24 w-1/3">
          <h2 className="mt-12 scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Changelog
          </h2>
          <ul className="mt-4 space-y-2">
            <li>
              <span className="font-semibold">v1.4.0</span> - Hi FS Team =). I
              hope you are doing well. I have two updates pushed out. The first
              is addressing the issue regarding the label redirect on order
              fulfillment. Ordoro actually changed how they create their own
              labels on their end, hence changing how they are accessed on our
              end. To circumvent this, I just changed it to redirect you to the
              unique order page per order on Ordoro. This will be a little bit
              slower but the alternative is downloading each label per order and
              having to make a separate request for each one. The second is I
              added a flag on office selection for Sage orders. This is similar
              to the RMA Hold flag, but for when an office has an initial Sage
              Order. In progress are the adding PerioStom to Aspen Order
              creation and some price updates. - John Sanchez
            </li>
            <li>
              <span className="font-semibold">v1.3.0</span> - Sage Orders are
              now supported. You can now create a shipping label for Sage
              orders!
            </li>
            <li>
              <span className="font-semibold">v1.2.6</span> - The packing list
              is now included in the shipment for orders. Fixed an issue where
              created orders were not displaying the price in all places -
              4/9/24
            </li>
            <li>
              <span className="font-semibold">v1.2.5</span> - Added a button to
              swap between who created orders, either my created orders (Orders
              that you have made) or all created Aspen orders (All orders that
              are not fulfilled). Reformatted the order helper function to help
              prepare for making a new form for all other non Shopify and Aspen
              orders. Also started preparations for a shipping tab. - 2/29/24
            </li>
            <li>
              <span className="font-semibold">v1.2.2</span> -
              <span className="font-semibold text-red-500"> RMA_Hold</span> is
              now correctly identified on offices that are waiting for a PO. -
              1/31/24
            </li>
            <li>
              <span className="font-semibold">v1.2.1</span> - FS-08 is now
              functioning correctly and a fix has been made for accessories.
              There is one more change for accessories needed. - 1/26/24
            </li>
            <li>
              <span className="font-semibold">v1.2.0</span> - Sales Tracker has
              been added. You can now export data for Aspen Orders and Shopify
              Orders only. More filters to come in the future! - 1/19/24
            </li>
            <li>
              <span className="font-semibold">v1.1.7</span> - Shopify has been
              disabled for the time being. You will not be able to access the
              page. Please process them manually. You can refer to the FS Way
              for instructions on how to process Shopify Orders. - 10/31/23
            </li>
            <li>
              <span className="font-semibold">v1.1.6</span> - Changed Aspen
              orders to be shipped FedEx Ground vs Home delivery for cheaper
              shipping costs - 10/30/23
            </li>
            <li>
              <span className="font-semibold">v1.1.5</span> - Added a calendar
              to the Create Order page. You can now add the correct order date
              for the order. Made some UI changes to the Aspen fulfill page. -
              7/13/23
            </li>
            <li>
              <span className="font-semibold">v1.1.0</span> - Fixed a bug where
              the pricing was incorrect in the ESL and the visual on the
              application. Thank you,{" "}
              <span className="font-semibold">@Kionna</span> for finding that
              and bringing it up! I am looking into the other changes at the
              moment with the dates and what not. I appreciate yall&apos;s
              feedback! - 7/04/23
            </li>
            <li>
              <span className="font-semibold">v1.0.5</span> - Added more
              accessory support. It is still recommended to only add 1 total
              accessory since the quantity is still messed up and prints one for
              each accessory added. Fix in progress. Please advise the{" "}
              <Link href="/aspen/faq">
                <span className="text-blue-600 underline">FAQ</span>
              </Link>{" "}
              for any questions. - 6/29/23
            </li>
          </ul>
          <ul className="mt-4 space-y-2">
            <li>
              <span className="font-semibold">v1.0.0</span> - Initial release -
              6/28/23
            </li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default Home;
