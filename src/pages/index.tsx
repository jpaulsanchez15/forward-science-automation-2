import Head from "next/head";

import { Cards } from "@/components/cards";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const cardInfo = [
  {
    title: "Shopify",
    description: "Fulfill an existing Shopify order",
  },
  {
    title: "Aspen",
    description: "Automate Aspen Orders",
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
        <section className="mt-24">
          <h2 className="mt-12 scroll-m-20 border-b pb-2 text-center text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Changelog
          </h2>
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
