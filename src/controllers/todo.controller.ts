import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ITodo } from "../models/todo.model";

const prisma = new PrismaClient();

const getTodoByUserId = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { todo: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const addTodo = async (req: Request, res: Response) => {
  try {
    const { title, description }: ITodo = req.body;
    const status = parseInt(req.body.status);
    const deadline = new Date(req.body.deadline).toISOString();
    const userId = parseInt(req.params.id);
    const todo = await prisma.todo.create({
      data: { title, description, status, userId, deadline },
    });

    return res.status(201).json({ data: todo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  try {
    const detailTodoId = parseInt(req.params.id);
    const { title, description }: ITodo = req.body;
    const status = parseInt(req.body.status);
    const deadline = new Date(req.body.deadline).toISOString();

    const todo = await prisma.todo.findUnique({ where: { id: detailTodoId } });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: detailTodoId },
      data: { title, description, status, deadline },
    });

    return res.status(201).json({ message: "Todo updated", data: updatedTodo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const updateStatus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const status = parseInt(req.body.status);
    const todo = prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updatedStatus = await prisma.todo.update({
      data: { status },
      where: { id },
    });
    return res
      .status(201)
      .json({ message: "Status updated", data: updatedStatus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    await prisma.todo.delete({ where: { id } });

    return res.status(201).json({ message: "Todo deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export default {
  getTodoByUserId,
  addTodo,
  updateTodo,
  updateStatus,
  deleteTodo,
};
