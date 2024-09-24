import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import { VanishList } from "./components/VanishList";
import { TodoList } from "../../components/todo-list";
import { TodoListWithSettings } from "../../components/todo-list-with-settings";

const { Title, Text } = Typography;

const TodoShow: React.FC = () => {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  return <TodoListWithSettings />;
};

export default TodoShow;
