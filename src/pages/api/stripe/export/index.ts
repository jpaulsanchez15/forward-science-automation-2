import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../../../env.mjs";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

// const customers = [
//   "cus_LCsYx8szaC5EW3",
//   "cus_KRDe3PsiYi5a6I",
//   "cus_KRDTW9gD7nOm5H",
//   "cus_KLbNSJz6qQunxR",
//   "cus_Jp15NI9bmJd9vX",
//   "cus_JofYdbT9VG1ZJg",
//   "cus_Jm302WOkT4RNc6",
//   "cus_JdlxGYXNeyC9wB",
//   "cus_JDyqIINOvcBNu1",
//   "cus_J63cueRDIMeDZl",
//   "cus_IutEDAWaGlxSh3",
//   "cus_IJlm0x2ZzQ2des",
//   "cus_GVmaFM1kTnBIHs",
//   "cus_GM3mDe2vl6dyCs",
//   "cus_GDnn6ufXOD6JD1",
//   "cus_GD3uyC5KFhm0sd",
//   "cus_FyRZzmV3CTtE7g",
//   "cus_Fmmj9VjaS1iQJP",
//   "cus_FiKXulPMKFqGzh",
//   "cus_FcIkdkJO43yOiQ",
//   "cus_FUsCVtaqnzfiDC",
//   "cus_FAdYaIlbYMYoH4",
//   "cus_EorPK2GUH6b8Gf",
//   "cus_EbOctqdGz2gV2K",
//   "cus_EZWqZeVHVdojl4",
//   "cus_EWTuCORFeumaLO",
//   "cus_EQtyIbs8A2w3Gn",
//   "cus_ELJUGVDMg31oco",
//   "cus_DnZBjpaqO9TGca",
//   "cus_DieY4pEKge0AL9",
//   "cus_DgRFKT5ICUzPt6",
//   "cus_DbXYsEs6TXO1ay",
//   "cus_DYZ9nSr0fP6dyu",
//   "cus_DY9VK9V79cZgyQ",
//   "cus_DWME4P4NffcTDt",
//   "cus_BkCAkR3ECp9JVh",
//   "cus_BMEbeueKM8UbyS",
//   "cus_AoTx5sdQvEdpxl",
//   "cus_AcWGY8dKXWLwA1",
//   "cus_AXDYhA4OqpHtAd",
//   "cus_ASLjQdK15vOkBG",
//   "cus_AFH3lFqzTaYhBd",
//   "cus_AAOFXNTAvo4F8F",
//   "cus_9CU2eSTQ58Rspi",
//   "cus_99oM6O8vSj0aTM",
//   "cus_7MarmWGyJiuIZS",
// ];

interface ConsolidatedCustomer {
  amount: number;
  email: string;
  customer: string;
}

const exportStripeReport = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const subscriptionInfo: Stripe.Response<Stripe.ApiList<Stripe.Subscription>> =
    await stripe.subscriptions.list({
      status: "unpaid" || "active",
      limit: 100,
    });

  const subscriptions = subscriptionInfo.data.map(
    (subscription) => subscription.customer
  );

  const delinquentCustomers: Array<
    Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>
  > = [];

  for (const subscription of subscriptions) {
    const customer = await stripe.customers.retrieve(subscription as string);
    if (!customer.deleted) {
      delinquentCustomers.push(customer);
    } else {
      continue;
    }
  }

  const missedCustomers: Array<Stripe.Invoice> = [];
  for (const customer of delinquentCustomers) {
    const totalPaymentsMissed = await stripe.invoices.list({
      customer: customer.id,
      limit: 100,
    });

    totalPaymentsMissed.data.map((payment) => {
      if (payment.status === "draft" || payment.status === "open") {
        missedCustomers.push(payment);
      }
    });
  }

  // const missedCustomersMap = missedCustomers.map((customer) => {
  //   const totalPayments = customer.amount_remaining;

  //   return {
  //     amount: totalPayments,
  //     email: customer.customer_email,
  //     customer: customer.customer,
  //     invoiceStatus: customer.status,
  //     subscriptionStatus: customer.deleted,
  //   };
  // });

  const missedCustomersMap: ConsolidatedCustomer[] = missedCustomers.reduce(
    (acc: ConsolidatedCustomer[], customer) => {
      if (!customer) {
        return acc;
      }
      const index = acc.findIndex((c) => c.email === customer.customer_email);
      if (index >= 0) {
        (acc[index] as unknown as ConsolidatedCustomer).amount +=
          customer.amount_remaining;
      } else {
        acc.push({
          amount: customer.amount_remaining,
          email: customer.customer_email as string,
          customer: `https://dashboard.stripe.com/customers/${
            customer.customer as string
          }`,
        });
      }

      return acc;
    },
    []
  );

  const finalMissedCustomers = Array.from(
    new Set(missedCustomersMap.map((customer) => customer.customer))
  ).map((customerId) => {
    return missedCustomersMap.find(
      (customer) => customer.customer === customerId
    );
  });

  const totalDebtReduced = missedCustomers.reduce((acc, curr) => {
    return acc + curr.amount_remaining;
  }, 0);

  const total = (totalDebtReduced / 100).toFixed(2);

  // const leftOverCustomers = delinquentCustomers.filter(
  //   (customer) => !customers.includes(customer.id)
  // );

  res.status(200).json({
    missed: total,
    missedCustomersMap: finalMissedCustomers,
    // leftOverCustomers: leftOverCustomers,
    // leftOverCustomersLen: leftOverCustomers.length,
    // finalMissedCustomers: finalMissedCustomers,
  });
};

export default exportStripeReport;
