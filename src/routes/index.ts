import { Request, Response, Router } from "express";
import userController from "../controllers/user.controller";
import authController from "../controllers/auth.controller";
import todoController from "../controllers/todo.controller";
import verifyToken from "../middleware/VerifyToken";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to your Todo app");
});

// Get all User
router.get("/api/v1/user", verifyToken, userController.getAllUser);
// Register User
router.post("/api/v1/user/register", authController.register);
// Login User
router.post("/api/v1/user/login", authController.login);

// TODO
// Get all TODO by User
router.get("/api/v1/user/:id/all-todo-list", todoController.getTodoByUserId);
// Add TODO by User
router.post("/api/v1/user/:id/add-todo-list", todoController.addTodo);
// Update data TODO
router.patch("/api/v1/todo/:id/update-todo-list", todoController.updateTodo);
// Update TODO Status
router.patch("/api/v1/todo/:id/update-status", todoController.updateStatus);
// Delete TODO by TODO's ID
router.delete("/api/v1/todo/:id/delete-todo", todoController.deleteTodo);

// Insert verifyToken as middleware to validate that each data need login user.

export default router;
