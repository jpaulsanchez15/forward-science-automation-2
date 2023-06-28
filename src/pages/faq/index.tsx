import Head from "next/head";

import { Cards } from "@/components/cards";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const cardInfo = [
  {
    title: "Shopify",
    description: "Shopify FAQ",
  },
  {
    title: "Aspen",
    description: "Aspen FAQ",
  },
];

const CardsList = () => {
  return (
    <div className="mx-auto flex flex-row items-center justify-center gap-4">
      {cardInfo.map((card) => {
        return (
          <Link key={card.title} href={`/${card.title.toLowerCase()}/faq`}>
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
        <title>Forward Science Automation | FAQ</title>
        <meta name="description" content="Forward Science Automation tool." />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <h1 className="mb-12 border-b-2  text-4xl font-bold">FAQ</h1>

        <CardsList />
      </main>
    </>
  );
};

export default Home;
