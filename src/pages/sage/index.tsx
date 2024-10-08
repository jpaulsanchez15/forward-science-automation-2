import { Cards } from "@/components/cards";
import Head from "next/head";
import Link from "next/link";

const cardInfo = [
  {
    title: "Create",
    description: "Create a new Sage order",
    content: "Prepare the Sage order in order to be processed.",
  },
  {
    title: "Fulfill",
    description: "Fulfill an existing Sage order",
    content: "Fulfill the Sage order in order to be processed.",
  },
  {
    title: "FAQ",
    description: "Frequently Asked Questions",
    content: "Click here to learn more.",
  },
];

const CardsList = () => {
  return (
    <div className="mx-auto flex flex-row items-center justify-center gap-4">
      {cardInfo.map((card) => {
        return (
          <Link key={card.title} href={`/sage/${card.title.toLowerCase()}`}>
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

const SageHome = () => {
  return (
    <main>
      <Head>
        <title>Forward Science Automation | Sage Home</title>
      </Head>
      <section className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-12 text-4xl font-bold">Sage Home</h1>
        <CardsList />
      </section>
      <section></section>
    </main>
  );
};

export default SageHome;
