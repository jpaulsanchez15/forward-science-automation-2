import type { NextApiResponse } from "next";
import type { NextApiRequestWithBody } from "@/types/ordoro";
import { api } from "@/utils/api";

const deleteAspenOrder = async (
  req: NextApiRequestWithBody,
  res: NextApiResponse
) => {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    const { data, mutateAsync } = api.aspenOrder.deleteOrder.useMutation();

    // Deletes the order from the database.
    await mutateAsync({ orderNumber: req.body.orderNumber });

    // Return the order.
    res.status(200).json({ data });
  }
};

export default deleteAspenOrder;
