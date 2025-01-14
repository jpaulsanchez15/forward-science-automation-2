/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { debounceValue } from "@/utils/debounceQuery";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import type { SugarOffice } from "@/types/sugar";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

//TODO: Find other accessories that I need to put in here.
type Accessories = {
  name: "fs84" | "fs88" | "fs08";
}[];

type Products = {
  name: "theraStom" | "oxiStom" | "salivaMax" | "oralID";
}[];

const accessories: Accessories = [
  { name: "fs84" },
  { name: "fs88" },
  { name: "fs08" },
];

const products: Products = [
  {
    name: "theraStom",
  },
  {
    name: "oxiStom",
  },
  {
    name: "salivaMax",
  },
  {
    name: "oralID",
  },
];

const formSchema = z.object({
  orderNumber: z.string().min(1, {
    message: "You need to provide an order number!",
  }),
  officeName: z.string().min(0, {
    message: "You need to provide an office name!",
  }),
  officeId: z.string().min(1, {
    message: "You need to provide an office name!",
  }),
  dateOrdered: z.date({
    required_error: "A date of birth is required.",
  }),
  products: z.object({
    theraStom: z.number().optional(),
    oxiStom: z.number().optional(),
    salivaMax: z.number().optional(),
    oralID: z.number().optional(),
    accessories: z.object({
      fs88: z.number().optional(),
      fs84: z.number().optional(),
      fs08: z.number().optional(),
    }),
  }),
  price: z.number().min(1, {
    message: "You need to provide a price!",
  }),
});

const ExampleForm = () => {
  const [query, setQuery] = useState<string>("");
  const [fetching, isFetching] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<SugarOffice[]>([]);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
      officeName: "",
      officeId: "",
      dateOrdered: new Date(),
      products: {
        theraStom: 0,
        oxiStom: 0,
        salivaMax: 0,
        oralID: 0,
        accessories: {
          fs88: 0,
          fs84: 0,
          fs08: 0,
        },
      },
      price: 0,
    },
    mode: "all",
  });

  const onSubmit = () => {
    toast({
      description: "Successfully used the example form!",
      variant: "success",
    });
    form.reset();

    return;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePriceChange = () => {
    const {
      theraStom = 0,
      salivaMax = 0,
      oxiStom = 0,
      oralID = 0,
      accessories: { fs84 = 0, fs88 = 0, fs08 = 0 } = {},
    } = form.watch("products");

    const price =
      theraStom * 69 +
      salivaMax * 120 +
      oxiStom * 27.9 +
      oralID * 1200 +
      fs84 * 20 +
      fs88 * 20 +
      fs08 * 125;

    form.setValue("price", price);
  };

  const debouncedQuery = debounceValue(query);

  useEffect(() => {
    (async () => {
      setSuggestions([]);
      isFetching(true);
      if (debouncedQuery.length > 0) {
        const res = await fetch(
          `/api/sugar/aspen/findAspenOffice?officeName=${debouncedQuery}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await res.json()) as SugarOffice[];

        isFetching(false);
        setSuggestions(data);
        return;
      }
    })();
  }, [debouncedQuery]);

  useEffect(() => {
    handlePriceChange();
  }, [form.watch("products"), handlePriceChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section id="office-information" className="grid grid-cols-4 gap-3">
          <FormField
            control={form.control}
            name="orderNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Order Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="officeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Office Name"
                    {...field}
                    value={
                      form.getValues("officeName") !== ""
                        ? form.getValues("officeName")
                        : query
                    }
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOrdered"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel>Date Ordered</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      //@ts-ignore
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    className="cursor-not-allowed"
                    readOnly
                    type="number"
                    placeholder="Price"
                    {...field}
                    onBlur={handlePriceChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <section id="products-section" className="grid grid-cols-4 gap-4">
          {products.map((product) => {
            return (
              <FormField
                control={form.control}
                key={product.name}
                name={`products.${product.name}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {product.name.charAt(0).toUpperCase() +
                        product.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="hover:cursor-pointer"
                        type="button"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (field.value === 0) return;
                          form.setValue(
                            `products.${product.name}`,
                            (field.value as number) - 1
                          );
                        }}
                        onClick={() =>
                          form.setValue(
                            `products.${product.name}`,
                            (field.value as number) + 1
                          )
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </section>
        <section id="accessories-dropdown">
          <Collapsible>
            <CollapsibleTrigger className="m-auto flex font-bold">
              Accessories
              <span>
                <ChevronDown />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="grid grid-cols-3 gap-3">
              {/* Make a clear field button to clear if the selection was wrong. */}
              {accessories.map((accessory) => {
                return (
                  <FormField
                    key={accessory.name}
                    control={form.control}
                    name={`products.accessories.${accessory.name}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{`${accessory.name.toUpperCase()}`}</FormLabel>
                        <FormControl>
                          <Input
                            className="hover:cursor-pointer"
                            type="button"
                            onContextMenu={(e) => {
                              e.preventDefault();
                              if (field.value === 0) return;
                              form.setValue(
                                `products.accessories.${accessory.name}`,
                                (field.value as number) - 1
                              );
                            }}
                            onClick={() =>
                              form.setValue(
                                `products.accessories.${accessory.name}`,
                                (field.value as number) + 1
                              )
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </section>

        <Button className="m-auto flex" type="submit">
          Submit
        </Button>

        <Link
          target="_blank"
          href={
            form.getValues("officeId") !== ""
              ? `https://forwardscience.sugarondemand.com/#Accounts/${form.getValues(
                  "officeId"
                )}`
              : ""
          }
        >
          <span className="mt-4 flex items-center justify-center text-center font-bold hover:underline dark:hover:text-gray-200">
            {form.getValues("officeId") !== ""
              ? "Selected Sugar Office Link Here"
              : null}
          </span>
        </Link>

        <div>
          {fetching && query !== "" ? (
            <span className="m-auto flex items-center justify-center text-center font-bold">
              Loading...
            </span>
          ) : null}
          <section
            className="m-auto grid w-full grid-cols-4 items-center justify-center gap-3"
            id="suggestion-map"
          >
            {suggestions.map((suggestion) => {
              return (
                <Button
                  type="button"
                  onClick={() => {
                    toast({
                      description: `Selected Office Name: ${suggestion.name}`,
                      variant: "success",
                    });
                    form.setValue("officeName", suggestion.name);
                    form.setValue("officeId", suggestion.id);
                    setSuggestions([]);
                    setQuery("");
                  }}
                  key={suggestion.id}
                >
                  {suggestion.name}
                </Button>
              );
            })}
          </section>
        </div>
      </form>
    </Form>
  );
};

export { ExampleForm };
