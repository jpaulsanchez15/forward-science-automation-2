import Head from "next/head";

import { Cards } from "@/components/cards";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as adobe from "@adobe/pdfservices-node-sdk";
import path from "path";

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

// const PDF_SERVICES_CLIENT_ID = "6b2c5d22b6da47e99f36219f1fe9272d";
// const PDF_SERVICES_CLIENT_SECRET = "p8e-zjZEPDlEhKgs2L_c90Wz5imHHE1BBptv";
// const ORGANIZATION_ID = "A6DB29ED641092660A495C53@AdobeOrg";

export const getServerSideProps = async () => {
  // const adobeCredentials =
  //   adobe.Credentials.servicePrincipalCredentialsBuilder()
  //     .withClientId(PDF_SERVICES_CLIENT_ID)
  //     .withClientSecret(PDF_SERVICES_CLIENT_SECRET)
  //     .build();

  // const adobeContext = adobe.ExecutionContext.create(adobeCredentials);

  // const INPUT_PDF = path.join(process.cwd(), "src", "pages", "test.pdf");

  // // Create a new operation instance.
  // const extractPDFOperation = adobe.ExtractPDF.Operation.createNew(),
  //   input = adobe.FileRef.createFromLocalFile(
  //     INPUT_PDF,
  //     adobe.ExtractPDF.SupportedSourceFormat.pdf
  //   );

  // // Build extractPDF options
  // const options = new adobe.ExtractPDF.options.ExtractPdfOptions.Builder()
  //   .addElementsToExtract(adobe.ExtractPDF.options.ExtractElementType.TEXT)
  //   .build();

  // extractPDFOperation.setInput(input);
  // extractPDFOperation.setOptions(options);

  // let outputFilePath = createOutputFilePath();

  // extractPDFOperation
  //   .execute(adobeContext)
  //   .then((result) => result.saveAsFile(outputFilePath))
  //   .then(() => {
  //     console.log("Successfully extracted information from PDF.");
  //   })
  //   .catch((err) => console.log(err));

  // function createOutputFilePath() {
  //   let date = new Date();
  //   let dateString =
  //     date.getFullYear() +
  //     "-" +
  //     ("0" + (date.getMonth() + 1)).slice(-2) +
  //     "-" +
  //     ("0" + date.getDate()).slice(-2) +
  //     "T" +
  //     ("0" + date.getHours()).slice(-2) +
  //     "-" +
  //     ("0" + date.getMinutes()).slice(-2) +
  //     "-" +
  //     ("0" + date.getSeconds()).slice(-2);
  //   return "output/ExtractTextTableInfoFromPDF/extract" + dateString + ".zip";
  // }

  // elements.map((element) => {
  //   element.Path == "//Document/Sect[2]/Table/TR/TD[2]/P"
  //     ? console.log(element.Text)
  //     : null;
  // });

  //Document/Sect[2]/Table/TR/TD[2]/P" - Order Number
  //Document/Sect[2]/Table/TR[2]/TD[2]/P - Order Date

  return {
    props: {},
  };
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
