import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { IUser } from "../models/user.model";

const prisma = new PrismaClient();

const getAllUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await prisma.user.findMany();
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(404).json({ error: "User list not found" });
  }
};

export default { getAllUser };
