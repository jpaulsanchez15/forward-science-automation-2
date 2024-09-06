/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { debounceValue } from "@/utils/debounceQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
import type { SugarOffice } from "@/types/sugar";
import { api } from "@/utils/api";
import { CalendarIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

//TODO: Find other accessories that I need to put in here.
//TODO: Add FS864, FS866, FS867

type Products = {
  name: "salivaMax" | "perioStomInitial" | "perioStom";
}[];

const products: Products = [
  {
    name: "salivaMax",
  },
  {
    name: "perioStomInitial",
  },
  {
    name: "perioStom",
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
    salivaMax: z.number().optional(),
    perioStomInitial: z.number().optional(),
    perioStom: z.number().optional(),
  }),
  price: z.number().min(1, {
    message: "You need to provide a price!",
  }),
});

const CreateSageForm = () => {
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
        salivaMax: 0,
        perioStomInitial: 0,
        perioStom: 0,
      },
      price: 0,
    },
    mode: "all",
  });

  const { isLoading: buttonDisabled, mutateAsync } =
    api.sageOrder.createOrder.useMutation({
      onSuccess: (data) => {
        toast({
          description: `Successfully created order ${data.orderNumber}`,
          variant: "success",
        });
        form.reset();
      },
      onError: (error) => {
        return toast({
          variant: "destructive",
          description: error.message,
        });
      },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutateAsync({
      ...values,
      trackingNumber: "",
      ordoroLink: "",
    });
    form.reset();

    return;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePriceChange = () => {
    const {
      salivaMax = 0,
      perioStomInitial = 0,
      perioStom = 0,
    } = form.watch("products");

    const price = salivaMax * 120 + perioStomInitial * 168 + perioStom * 168;

    form.setValue("price", price);
  };

  const debouncedQuery = debounceValue(query);

  useEffect(() => {
    (async () => {
      isFetching(true);
      setSuggestions([]);
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

        <Button disabled={buttonDisabled} className="m-auto flex" type="submit">
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
                  className="h-full w-full"
                  onClick={() => {
                    toast({
                      description: `Selected Office Name: ${suggestion.name}`,
                    });
                    form.setValue("officeName", suggestion.name);
                    form.setValue("officeId", suggestion.id);
                    setSuggestions([]);
                    setQuery("");
                  }}
                  key={suggestion.id}
                >
                  <ul>
                    <li>
                      {suggestion.tag.map((tag) => {
                        if (tag.name === "PerioStom") {
                          return (
                            <span
                              key={tag.id}
                              className="ml-2 text-2xl font-bold text-blue-500"
                            >
                              **{tag.name}**
                            </span>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </li>
                    <li>Name: {suggestion.name}</li>
                    <li>Street: {suggestion.shipping_address_street}</li>
                    <li>City: {suggestion.shipping_address_city}</li>
                    <li>State: {suggestion.shipping_address_state}</li>
                    <li>Zip: {suggestion.shipping_address_postalcode}</li>
                  </ul>
                </Button>
              );
            })}
          </section>
        </div>
      </form>
    </Form>
  );
};

export { CreateSageForm };
