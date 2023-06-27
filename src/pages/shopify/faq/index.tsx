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
            <Tooltips text="This alerts you if it is an Ambassador order.">
              <Info className="right-0 top-0 flex" />
            </Tooltips>
            <Tooltips text="This will fire off if there is no NPI number.">
              <AlertTriangle />
            </Tooltips>
          </div>

          <Tooltips text="This is the order number for the order and links you to the label.">
            <CardTitle>Order: 1234</CardTitle>
          </Tooltips>
          <Tooltips text="This links you to the Shopify Order.">
            <CardDescription>
              <Link
                target="_blank"
                href={`https://oralid.myshopify.com/admin/orders`}
              >
                Shopify Link
              </Link>
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
          <Tooltips text="This button will create the label. Once created, it will switch to Add to Sugar, and you can add it to Sugar from there.">
            Create Label
          </Tooltips>
        </Button>
      </Card>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="m-auto mx-8 my-12 flex flex-col items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        How to use the <span className="text-green-400">Shopify</span>{" "}
        Automation
      </h1>
      {/* <p className="leading-7 [&:not(:first-child)]:mt-6">
        Once upon a time, in a far-off land, there was a very lazy king who
        spent all day lounging on his throne. One day, his advisors came to him
        with a problem: the kingdom was running out of money.
      </p> */}
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        What does this do and not do?
      </h3>
      {/* <p className="leading-7 [&:not(:first-child)]:mt-6">
        The people of the kingdom, feeling uplifted by the laughter, started to
        tell jokes and puns again, and soon the entire kingdom was in on the
        joke.
      </p> */}
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
                Identify Ambassador orders
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                <Check />
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Identify orders with no NPI
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                <Check />
              </td>
            </tr>
            <tr className="m-0 border-t p-0 even:bg-muted">
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                Create follow up task for Product Specialist
              </td>
              <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                <Check />
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
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        How to use this tool
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        <ExampleCards />
      </p>
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        Hover over each part of the card above to see what it is and what they
        mean.
      </blockquote>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Steps
      </h3>
      <ol className="my-6 ml-6 w-1/4 list-decimal border border-b-0 border-l-2 border-r-2 border-t-0  [&>li]:mt-2">
        <li>
          Click the <span className="italic">Shopify Link</span> text to open
          the page. Verify that the shipping address information is correct.
          Make sure the address has an office included in the address. If it{" "}
          <span className="bg-red-500 text-black dark:text-white">
            DOES NOT
          </span>{" "}
          have one, go into Ordoro and edit the address to include the office.
        </li>
        <li>
          After you check that is correct, click the{" "}
          <span className="italic">Create Label</span> button. This will create
          the label in Ordoro and prepare it to be added into Sugar. After it is
          created and no errors have gone through (You will get notified if
          there was an error), the button will switch to{" "}
          <span className="italic">Add to Sugar</span>. Click the swapped button
          to be able to add the order information to Sugar.
        </li>
        <li>
          It will search for the office in Sugar. If the office in Sugar{" "}
          <span className="bg-red-500 text-black dark:text-white">
            DOES NOT
          </span>{" "}
          exist, it will throw and error at you and then you will have to do the
          rest manually. (See below for the caveats section on how to deal with
          this!) If it does find an office, it will show a window with the
          offices it found. Select the correct office, then click the{" "}
          <span className="italic">Pick this one!</span>button. The window will
          close and the order will be completed.
        </li>
        <li>Done!</li>
      </ol>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        As a result, people stopped telling jokes, and the kingdom fell into a
        gloom. But there was one person who refused to let the king's
        foolishness get him down: a court jester named Jokester.
      </p>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        Jokester's Revolt
      </h3>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Jokester began sneaking into the castle in the middle of the night and
        leaving jokes all over the place: under the king's pillow, in his soup,
        even in the royal toilet. The king was furious, but he couldn't seem to
        stop Jokester.
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        And then, one day, the people of the kingdom discovered that the jokes
        left by Jokester were so funny that they couldn't help but laugh. And
        once they started laughing, they couldn't stop.
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        The king, seeing how much happier his subjects were, realized the error
        of his ways and repealed the joke tax. Jokester was declared a hero, and
        the kingdom lived happily ever after.
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        The moral of the story is: never underestimate the power of a good laugh
        and always be careful of bad ideas.
      </p>
    </div>
  );
};

export default FAQ;
