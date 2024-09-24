import React from "react";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { useNavigation, useDelete, BaseRecord } from "@refinedev/core";
import { ColumnType } from "antd/es/table";

const UserList: React.FC = () => {
  const { tableProps } = useTable();
  const { show, edit } = useNavigation();
  const { mutate } = useDelete();

  const columns = [
    { dataIndex: "id", title: "ID", sorter: true },
    { dataIndex: "username", title: "Username", sorter: true },
    { dataIndex: "email", title: "Email", sorter: true },
    {
      dataIndex: "role",
      title: "Role",
      sorter: true,
      render: (role: string) => (
        <Tag color={role === "super_admin" ? "red" : "blue"}>
          {role || "N/A"}
        </Tag>
      ),
    },
    {
      dataIndex: "created_at",
      title: "Created At",
      sorter: true,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: { id: string }) => (
        <Space>
          <ShowButton hideText size="small" recordItemId={record.id} />
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
      align: "end",
    },
  ] as ColumnType<BaseRecord>[];

  return <Table {...tableProps} columns={columns} rowKey="id" />;
};

export default UserList;
