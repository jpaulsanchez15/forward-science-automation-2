import { Cards } from "@/components/cards";
import Head from "next/head";
import Link from "next/link";

const cardInfo = [
  {
    title: "Shopify",
    description: "See Shopify Orders",
    content: "See all the Shopify orders that have been processed.",
  },
  {
    title: "Aspen",
    description: "See Aspen Orders",
    content: "See all the Aspen orders that have been processed.",
  },
];

const CardsList = () => {
  return (
    <div className="mx-auto flex flex-row items-center justify-center gap-4">
      {cardInfo.map((card) => {
        return (
          <Link
            key={card.title}
            href={`/sales-tracker/${card.title.toLowerCase()}`}
          >
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

const AspenHome = () => {
  return (
    <main>
      <Head>
        <title>Forward Science Automation | Aspen Home</title>
      </Head>
      <section className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-12 text-4xl font-bold">Aspen Home</h1>
        <CardsList />
      </section>
      <section></section>
    </main>
  );
};

export default AspenHome;
