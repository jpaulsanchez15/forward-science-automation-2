import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db";

const exportData = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
  } else {
    const { date } = req.query;
    const data = await prisma.aspenOrder.findMany({
      where: {
        createdAt: {
          gte: new Date(date as string),
        },
      },
    });

    const salesTrackerData = data
      .filter((item) => {
        if (item.therastom! > 0 || item.oxistom! > 0 || item.salivamax! > 0) {
          return true;
        }
        return false;
      })
      .map((item) => {
        return {
          orderNumber: item.orderNumber,
          orderDate: item.createdAt,
          product: {
            therastom: item.therastom! > 0 ? item.therastom : undefined,
            oxistom: item.oxistom! > 0 ? item.oxistom : undefined,
            salivamax: item.salivamax! > 0 ? item.salivamax : undefined,
          },
        };
      });

    console.log(salesTrackerData);

    res.status(200).json(salesTrackerData);
  }
  return;
};

export default exportData;
