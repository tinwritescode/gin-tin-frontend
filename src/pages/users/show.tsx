import React from "react";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title, Text } = Typography;

const UserShow: React.FC = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>ID</Title>
      <Text>{record?.id}</Text>

      <Title level={5}>Username</Title>
      <Text>{record?.username}</Text>

      <Title level={5}>Email</Title>
      <Text>{record?.email}</Text>

      <Title level={5}>Role</Title>
      <Text>{record?.role}</Text>

      <Title level={5}>Created At</Title>
      <Text>{new Date(record?.created_at).toLocaleString()}</Text>

      <Title level={5}>Updated At</Title>
      <Text>{new Date(record?.updated_at).toLocaleString()}</Text>

      <Title level={5}>Deleted At</Title>
      <Text>
        {record?.deleted_at
          ? new Date(record?.deleted_at).toLocaleString()
          : "Not deleted"}
      </Text>
    </Show>
  );
};

export default UserShow;
