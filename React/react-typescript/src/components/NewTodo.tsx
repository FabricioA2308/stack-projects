import { FormEvent, useRef } from "react";
import classes from "./NewTodo.module.css";
import { useContext } from "react";
import { TodosContext } from "../store/todos-context";

export default function NewTodo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTodo } = useContext(TodosContext);

  function submitFormHandler(event: FormEvent) {
    event.preventDefault();

    const inputText = inputRef.current!.value;

    if (inputText.trim().length === 0) {
      return;
    }

    addTodo(inputText);
  }

  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      <label htmlFor="text">Todo Text</label>
      <input type="text" id="text" ref={inputRef} />
      <button type="submit">Add todo</button>
    </form>
  );
}
