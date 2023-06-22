/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
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
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

//TODO: Find other accessories that I need to put in here.
type Accessories = {
  name: "fs84" | "fs88";
}[];

const accessories: Accessories = [{ name: "fs84" }, { name: "fs88" }];

const formSchema = z.object({
  orderNumber: z.string().min(1, {
    message: "You need to provide an order number!",
  }),
  officeName: z.string().min(1, {
    message: "You need to provide an office name!",
  }),
  products: z.object({
    theraStom: z.number().optional(),
    oxiStom: z.number().optional(),
    salivaMax: z.number().optional(),
    oralID: z.number().optional(),
    accessories: z.object({
      fs88: z.number().optional(),
      fs84: z.number().optional(),
    }),
  }),
  price: z.number().min(1, {
    message: "You need to provide a price!",
  }),
});

const CreateAspenForm = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentOffice, setCurrentOffice] = useState<string>("");
  const [question, showQuestion] = useState(false);
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
      officeName: "",
      products: {
        theraStom: 0,
        oxiStom: 0,
        salivaMax: 0,
        oralID: 0,
        accessories: {
          fs88: 0,
          fs84: 0,
        },
      },
      price: 0,
    },
    mode: "all",
  });

  const createOrder = api.aspenOrder.createOrder.useMutation({
    onSuccess: (data) => {
      toast.success(`Successfully created order ${data.orderNumber}`);
      form.reset();
    },
    onError: (error) => {
      return toast.error(error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Successfully created order", {
      position: "bottom-center",
    });
    form.reset();
    // createOrder.mutateAsync(values)

    return;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePriceChange = () => {
    const {
      theraStom = 0,
      salivaMax = 0,
      oxiStom = 0,
      oralID = 0,
      accessories: { fs84 = 0, fs88 = 0 } = {},
    } = form.watch("products");

    const price =
      theraStom * 63 +
      salivaMax * 120 +
      oxiStom * 25.5 +
      oralID * 1200 +
      fs84 * 20 +
      fs88 * 20;

    form.setValue("price", price);
  };

  const debouncedQuery = debounceValue(query);

  useEffect(() => {
    (async () => {
      setSuggestions([]);
      setError("");
      if (debouncedQuery.length > 0) {
        isLoading(true);
        const res = await fetch(
          `/api/sugar/aspen/findAspenOffice?officeName=${debouncedQuery}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          isLoading(false);
          setSuggestions([]);
          setError("No results found.");
          return;
        }

        const data = await res.json();
        console.log(data);

        setSuggestions(data);
        isLoading(false);
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
        <section id="office-information" className="grid grid-cols-3 gap-3">
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
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </FormControl>
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
          <FormField
            control={form.control}
            name="products.theraStom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TheraStom</FormLabel>
                <FormControl>
                  <Input
                    className="hover:cursor-pointer"
                    type="button"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (field.value === 0) return;
                      form.setValue(
                        "products.theraStom",
                        (field.value as number) - 1
                      );
                    }}
                    onClick={() =>
                      form.setValue(
                        "products.theraStom",
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
          <FormField
            control={form.control}
            name="products.oxiStom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OxiStom</FormLabel>
                <FormControl>
                  <Input
                    className="hover:cursor-pointer"
                    type="button"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (field.value === 0) return;
                      form.setValue(
                        "products.oxiStom",
                        (field.value as number) - 1
                      );
                    }}
                    onClick={() =>
                      form.setValue(
                        "products.oxiStom",
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
          <FormField
            control={form.control}
            name="products.salivaMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SalivaMAX</FormLabel>
                <FormControl>
                  <Input
                    className="hover:cursor-pointer"
                    type="button"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (field.value === 0) return;
                      form.setValue(
                        "products.salivaMax",
                        (field.value as number) - 1
                      );
                    }}
                    onClick={() =>
                      form.setValue(
                        "products.salivaMax",
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
          <FormField
            control={form.control}
            name="products.oralID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OralID</FormLabel>
                <FormControl>
                  <Input
                    className="hover:cursor-pointer"
                    type="button"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (field.value === 0) return;
                      form.setValue(
                        "products.oralID",
                        (field.value as number) - 1
                      );
                    }}
                    onClick={() =>
                      form.setValue(
                        "products.oralID",
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
      </form>
    </Form>
  );
};

export { CreateAspenForm };
