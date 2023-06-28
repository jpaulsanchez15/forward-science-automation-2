import { AlertTriangle, Check, Info, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Head from "next/head";
import { ExampleForm } from "@/components/exampleForm";

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

const ExampleCards = () => {
  return (
    <div className="h-full">
      <Card className="h-full w-full">
        <CardHeader>
          <div className="flex flex-row gap-3">
            <Tooltips text="This will allow you to delete the order. NOTE: This is only from the database, and not the other platforms. You will need to go to the other platforms and delete information there if you progressed any further.">
              <X className="right-0 top-0 flex" />
            </Tooltips>
          </div>

          <Tooltips text="This is the order number for the order and links you to the label.">
            <CardTitle>Order: 1234</CardTitle>
          </Tooltips>
          <Tooltips text="This shows who its for">
            <CardDescription>
              For: Aspen Dental - Office Name - Number
            </CardDescription>
          </Tooltips>
        </CardHeader>
        <CardContent className="flex flex-col">
          <Tooltips text="These are the contents of the order.">
            <ul>1 x TheraStom 6pk</ul>
          </Tooltips>
          <Tooltips text="This is the price of the order.">
            <p>Price: $60</p>
          </Tooltips>
        </CardContent>

        <Button
          className={`m-auto mb-4 flex flex-col items-center justify-center`}
        >
          Create Order
        </Button>
        <Tooltips text="This button will create the label. Once created, it will switch to Process Order, and you can create the label and add it to Sugar.">
          (Button information. Not here on actual page.)
        </Tooltips>
      </Card>
    </div>
  );
};

const FAQ = () => {
  return (
    <>
      <Head>
        <title>Forward Science Automation | Aspen Automation FAQ</title>
      </Head>
      <div className="m-auto mx-8 my-12 flex flex-col items-center justify-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          How to use the <span className="text-blue-400">Aspen</span> Automation
        </h1>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          What does this do and not do?
        </h3>
        <div className="my-6 w-full overflow-y-auto">
          <table className="m-auto w-1/3 items-center justify-center">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  Step in the Manual Process
                </th>
                <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                  Does it?
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Create the label
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  <Check />
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Create the shiplog in Sugar
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  <Check />
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Create unadded offices?
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  <X />
                </td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  Greatly improve processing time
                </td>
                <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                  <Check />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 className="mb-12 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          How to use this tool
        </h2>
        <div>
          <ExampleForm />
        </div>
        <div className="leading-7 [&:not(:first-child)]:mt-6">
          <ExampleCards />
        </div>
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          Hover over each part of the card above to see what it is and what they
          mean.
        </blockquote>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          Steps
        </h3>
        <ol className="my-6 ml-6 w-1/4  list-decimal  [&>li]:mt-2">
          <li>
            Start with the <span className="italic">Create Order page.</span>{" "}
            Enter the order number, enter the 4 digit code of the office in the
            Office Name bar, then, in the bottom of the page see the suggestions
            that pop up. Click the correct one and you should see the correct
            one. Note: If you selected the wrong office, refresh the page. I
            know, sorry. Then, click the products that they ordered. Left click
            to add, right click to subtract. After you have added the products,
            hit submit.
          </li>
          <li>
            After you've created the orders, go to the{" "}
            <span>Fulfill Order</span> page. Click the{" "}
            <span className="italic">Create Order</span> button and then wait
            for the order to create. You can only do one at a time, so the
            button will be disabled for all orders. After the order is created,
            wait a few seconds, then you can click the{" "}
            <span className="italic">Process Order</span>button. This will
            create the label.
          </li>
          <li>
            The checkmark is a button! When you are done printing the label, you
            can click the checkmark and it will file it away. As of 6/28, there
            is not a view for filed away orders, but it will be added shortly.
          </li>
          <li>
            Done! Double check everything was done correctly by checking the
            Shiplog in Sugar and the follow-up task was made. Print out the
            label and the order sheet using the links provided on the order.
          </li>
        </ol>
        <h3 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Caveats and Known Bugs
        </h3>
        <ul className="my-6 ml-6 w-1/4  list-disc  [&>li]:mt-2">
          <li>
            What do I do if I can't find the office in Sugar?
            <ul className="my-6 ml-6 w-full  list-disc  [&>li]:mt-2">
              <li>
                Try using the 4 digit office code. If that doesn't work, try the
                office city and location. If not, look up the address in Sugar
                and see if it has a different name, then correct the office
                according to the most recent information we recieved.
              </li>
            </ul>
          </li>
          <li>
            Does this process accessories?
            <ul className="my-6 ml-6 w-full  list-disc  [&>li]:mt-2">
              <li>
                Yes and no. Yes, it literally does, however if there are
                multiple accessories, it will make multiple labels. It is
                generally recommended as of 6/28 to not use this tool for
                accessories, unless there is only one accessory.
              </li>
            </ul>
          </li>
          <li>
            I made an order but messed up. I deleted it after I made the order
            in Ordoro, but now I'm getting an error.
            <ul className="my-6 ml-6 w-full  list-disc  [&>li]:mt-2">
              <li>
                You'll need to delete that order, then when you recreate the
                order, make sure the PO has an extra number at the end of it.
                This is because Ordoro requires a unique number for each order
                created.
              </li>
            </ul>
          </li>
          <li>
            All other bugs can be reported in Asana,{" "}
            <Link
              target="_blank"
              href="https://app.asana.com/0/1201822012671728/1204876077045703"
            >
              <span className="text-blue-700 underline hover:cursor-pointer hover:text-blue-900">
                here!
              </span>
            </Link>
            <ul className="my-6 ml-6 w-full  list-disc  [&>li]:mt-2">
              <li>
                Please provide an accurate description of what happened, maybe a
                photo of the error, and what you were doing when it happened. If
                possible, provide a way to recreate it as well. Thank you.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
};

export default FAQ;
