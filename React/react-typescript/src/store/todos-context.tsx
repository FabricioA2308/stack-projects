import React, { ReactNode, useState } from "react";
import Todo from "../models/todo";

type TodosContextObj = {
  items: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
};

export const TodosContext = React.createContext<TodosContextObj>({
  items: [],
  addTodo: () => {},
  removeTodo: () => {},
});

interface Props {
  children?: ReactNode;
}

const TodosContextProvider = ({ children }: Props) => {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const addTodoHandler = (text: string) => {
    setTodoList((prevTodoList) => [
      ...prevTodoList,
      { id: Math.random().toString(), text },
    ]);
  };

  const deleteTodoHandler = (id: string) => {
    setTodoList((prevTodoList) =>
      prevTodoList.filter((todo) => todo.id !== id)
    );
  };

  const contextValue: TodosContextObj = {
    items: todoList,
    addTodo: addTodoHandler,
    removeTodo: deleteTodoHandler,
  };

  return <TodosContext.Provider value={contextValue}>{children}</TodosContext.Provider>;
};

export default TodosContextProvider;
