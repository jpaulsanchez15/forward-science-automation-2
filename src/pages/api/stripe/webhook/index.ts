// import { NextApiRequest, NextApiResponse } from "next";
// import { env } from "../../../../env.mjs";
// import asana from "asana";
// import Stripe from "stripe";

// const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
//   apiVersion: "2022-11-15",
// });

// const client = asana.Client.create({
//   defaultHeaders: { "asana-enable": "new_goal_memberships" },
// }).useAccessToken(env.ASANA_API_KEY);

// const workspace = "167190183324247";
// const project = ["1203580204746544"];
// const section = "1204375456066966";

// // const kK = "1202383792007733";
// // const jS = "1202162741058510";
// // const mH = "1202607323248276";
// // const followers = [kK, jS, mH];

// const missedPaymentNotification = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   if (
//     req.body.type == "customer.subscription.updated" &&
//     req.body.data.object.status == "unpaid"
//   ) {
//     const {
//       customer,
//     }: {
//       customer: string;
//     } = req.body.data.object;

//     const customerInfo: Stripe.Customer | Stripe.DeletedCustomer =
//       await stripe.customers.retrieve(customer);

//     if (customerInfo.deleted) {
//       return res.status(200).end();
//     } else {
//       const { id, email, name } = customerInfo;

//       const sugarRequest = await fetch(
//         `https://forward-science-automation.vercel.app/api/sugar/stripe/webhook?email=${
//           email ?? ""
//         }`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//         }
//       );

//       const sugarResponse = await sugarRequest.json();

//       const description = `${name}'s account is unpaid! \nCustomer link here: https://dashboard.stripe.com/customers/${id}
//       \nHere are the emails we found for this customer in Sugar: ${sugarResponse.message}
//       \nHere is the link to the office in Sugar: ${env.SUGAR_BASE_URL}#Accounts/${sugarResponse.id}\nIf the link does not work, please look up the office in Sugar yourself.`;

//       // Thanks ChatGPT
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = String(today.getMonth() + 1).padStart(2, "0");
//       const day = String(today.getDate()).padStart(2, "0");
//       const currentDate = `${year}-${month}-${day}`;

//       const taskCreated = await client.tasks.create({
//         workspace: workspace,
//         projects: project,
//         name: `Unpaid Account Notification - ${name}`,
//         // followers: followers,
//         notes: description,
//         due_on: currentDate,
//       });

//       await client.sections.addTask(section, {
//         task: taskCreated.gid,
//       });

//       res.status(200).json({ message: "Sent to Asana", task: taskCreated });
//     }
//   } else {
//     res.status(500).json({ message: "Not a missed payment notification" });
//   }
//   return;
// };

// export default missedPaymentNotification;
