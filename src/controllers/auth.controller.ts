import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password }: IUser = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { email, name, password: hashPassword },
    });

    return res.status(201).json({ message: "Register successful", data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const userId = user.id;
    const userEmail = user.email;
    const userName = user.name;

    const accessToken = jwt.sign(
      { userId, userEmail, userName },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: "50s" }
    );

    return res
      .status(200)
      .json({ message: "Login Successful", token: accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default { register, login };
