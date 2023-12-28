import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Typography } from "antd";
import React, { useState } from "react";

import { ModalType } from "../BankAccountModal";
import { BankAccount, BankAccountStatus } from "~/models/bankAccount";
import { Breakpoint } from "~/types";

interface TableColumn {
  title: string;
  dataIndex?: keyof BankAccount;
  key?: keyof BankAccount;
  sorter?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, record: BankAccount, index: number) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface BankAccountTableProps {
  data: BankAccount[] | undefined;
  refreshData: () => void;
  handleChangeListIdsBankAccountForDelete: (ids: React.Key[]) => void;
  handleDeleteOneBankAccount: (id: any) => void;
  handleShowModalBankAccount: (
    type?: ModalType,
    bankAccountId?: number,
  ) => void;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

const BankAccountTable = ({
  data,
  handleChangeListIdsBankAccountForDelete,
  handleDeleteOneBankAccount,
  handleShowModalBankAccount,
}: BankAccountTableProps) => {
  const [bankAccountSelectedKeys, setBankAccountSelectedKeys] = useState<
    React.Key[]
  >([]);

  const COLUMNS: TableColumn[] = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (__, record, index) => <strong>{index + 1}</strong>,
    },
    {
      title: "Chủ tài khoản",
      dataIndex: "bankAccountName",
      key: "bankAccountName",
      align: "left",
    },
    {
      title: "Tên ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
      align: "left",
    },
    {
      title: "Số tài khoản",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (__id, record) => {
        switch (record.status) {
          case BankAccountStatus.ACTIVE:
            return (
              <div className="!flex items-center justify-center">
                <Typography.Text className="text-[14px] !text-success font-semibold  rounded-md ">
                  Hoạt động
                </Typography.Text>
              </div>
            );
          case BankAccountStatus.IN_ACTIVE:
            return (
              <div className="!flex items-center justify-center">
                <button className="text-[14px] !text-danger  rounded-md font-semibold">
                  Ngưng hoạt động
                </button>
              </div>
            );
          default:
        }
      },
      responsive: ["xl"],
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (__, record: BankAccount) => (
        <div className="flex justify-center gap-2 text-center">
          <div>
            <Button
              type="primary"
              className="!flex items-center justify-center !rounded-lg"
              onClick={() =>
                handleShowModalBankAccount(ModalType.UPDATE, record.id)
              }
            >
              <EditOutlined />
            </Button>
          </div>

          <div>
            <Popconfirm
              onConfirm={() => handleDeleteOneBankAccount(record.id)}
              okText="Có"
              cancelText="Không"
              title="Xác nhận xóa tài khoản ngân hàng này"
            >
              <Button
                type={"danger" as "primary"}
                className={` flex  items-center justify-center !rounded-lg`}
              >
                <DeleteOutlined className="!flex" />
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  const onChangeListChecked = (newSelectedRowKeys: React.Key[]) => {
    setBankAccountSelectedKeys(newSelectedRowKeys);
    handleChangeListIdsBankAccountForDelete(newSelectedRowKeys);
  };

  const rowSelection = {
    bankAccountSelectedKeys,
    onChange: onChangeListChecked,
  };

  return (
    <>
      {data && (
        <Table
          rowSelection={rowSelection}
          rowKey="id"
          dataSource={data}
          columns={COLUMNS}
          className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
          rowClassName="text-black dark:text-white"
          pagination={false}
        />
      )}
    </>
  );
};

export default BankAccountTable;
