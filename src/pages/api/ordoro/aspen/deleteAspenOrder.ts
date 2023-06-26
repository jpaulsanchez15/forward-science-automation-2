import { prisma } from "@/server/db";
import type { NextApiRequestWithBody } from "@/types/ordoro";
import type { NextApiResponse } from "next";

const deleteAspenOrder = async (
  req: NextApiRequestWithBody,
  res: NextApiResponse
) => {
  if (req.method !== "DELETE") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  } else {
    console.log(req.body);
    // Deletes the order from the database.
    const order = await prisma.aspenOrder.delete({
      where: {
        orderNumber: req.body?.orderNumber,
      },
    });

    // Return the order.
    res.status(200).json({ order });
  }
};

export default deleteAspenOrder;
