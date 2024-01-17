import Todo from "../models/todo";
import classes from "./TodoItem.module.css";
import { useContext } from "react";
import { TodosContext } from "../store/todos-context";

type TodosProps = {
  todo: Todo;
  children?: string;
};

export default function TodoItem({ todo }: TodosProps) {
  const { removeTodo } = useContext(TodosContext);

  return (
    <>
      <li className={classes.item}>{todo.text}</li>
      <button onClick={() => removeTodo(todo.id)}>Delete /\</button>
    </>
  );
}
