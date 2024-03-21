import { Router } from "express";

import { Todo } from "../models/todo";

type RequestBody = { text: string };
type RequestParams = { todoId: string };

let todos: Todo[] = [];

const router = Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({ todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as RequestBody;
  if (!req.body.text) {
    return res.status(404).json({ message: "Text input not found." });
  }

  const newTodo: Todo = { text: body.text, id: new Date().toISOString() };
  todos.push(newTodo);
  res.status(201).json({ message: "Todo created!" });
});

router.put("/todo/:todoId", (req, res, next) => {
  const body = req.body as RequestBody;
  const params = req.params as RequestParams;
  const todoId = params.todoId;

  const todoIndex = todos.findIndex((todo) => todo.id === todoId);

  if (todoIndex <= -1) {
    return res.status(404).json({ message: "Todo not found." });
  }

  todos[todoIndex] = {
    id: todos[todoIndex].id,
    text: body.text,
  };

  return res.status(200).json({ message: "Updated todo!", todos });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const todoId = params.todoId;
  
  todos = todos.filter((todo) => todo.id !== todoId);

  return res.status(203).json({ message: "Deleted todo.", todos });
});

export default router;
