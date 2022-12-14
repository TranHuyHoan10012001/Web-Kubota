import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import { Table, Breadcrumb, Menu, Row, Col, Modal, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import * as queryString from "query-string";
import EditModal from "./orderDetail/EditModal";
import { BASE_URL } from "../../../../apiConfig";
const AdminOrder = ({
  // loading,
  // displayedOrders,
  // fetchOrderDetails,
  // isEdit,
  // setIsEdit,
  // changeStatus,
  // modalInfo,
  // orderDetail,
}) => {
  const columns = [
    {
      // key: 'id',
      title: "Mã đơn",
      dataIndex: "id",
    },
    {
      // key: 'user_id',
      title: "Mã khách hàng",
      dataIndex: "user_id",
    },
    {
      // key: 'status',
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      filters: [
        {
          text: "đang được giao",
          value: "đang được giao",
        },
        {
          text: "đã được giao",
          value: "đã được giao",
        },
        {
          text: "chờ xét duyệt",
          value: "chờ xét duyệt",
        },
        {
          text: "hủy",
          value: "hủy",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      // key: 'status',
      title: "Ngày tạo đơn",
      dataIndex: "createdAt",
      sorter: (record1, record2) => {
        return record1.createdAt > record2.createdAt;
      },
    },
    {
      key: "action",
      title: "Actions",
      render: (text, record, index) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                fetchOrderDetails(record.id, record);
              }}
            />
            <DeleteOutlined
              onClick={(text, record, index) => {
                // onDeleteOrder(text, record, index);
              }}
              style={{ color: "red", marginLeft: "12px" }}
            />
          </>
        );
      },
    },
  ];


  const [orders, setOrders] = useState([{}]);
  const [displayedOrders, setDisplayedOrders] = useState([{}]);
  const [isEdit, setIsEdit] = useState(false);
  const [orderDetail, setOrderDetail] = useState([{}]);
  const [modalInfo, setModalInfo] = useState({});

  const [loading, setLoading] = useState(true);

  const getAllOrders = async () => {
    await axios.get(`${BASE_URL}/api/orders/alltest/test`).then(async (res) => {
      setOrders(
        res.data.rows.map((row) => ({
          id: row.id,
          user_id: row.user_id,
          User: {...row.User},
          status: row.status.toString(),
          createdAt: row.createdAt,
          note: row.note,
        }))
      );

      setDisplayedOrders(orders);
      setLoading(false);
      console.log(res.data);
    });
  }

  //fetch khởi tạo
  useEffect(() => {
    getAllOrders()
  }, []);

  //fetch chi tiết
  const fetchOrderDetails = async (id, record) => {
    setLoading(true);
    await axios
      .get(`${BASE_URL}/api/orders/${id}`)
      .then((res) => {
        setOrderDetail(
          res.data.flatMap((items) => ({
            productId: items.id,
            productName: items.name,
            quantity: items.order_details.map(
              (detail) => detail.quantityOrdered
            ),
            priceEach: items.order_details.map((detail) =>
              (detail.priceEach)
            ),
            total: items.order_details.map((detail) =>
              (detail.priceEach * detail.quantityOrdered)
            ),
          }))
        );
        setModalInfo(record);
      })
      .finally(() => {
        setLoading(false);
        setIsEdit(true);
      });
  };

  useEffect(() => {
    setDisplayedOrders(orders);
  }, [orders]);

  //fetch đổi trạng thái
  const changeStatus = async (status, orderId) => {
    console.log(orderId);
    setIsEdit(false);
    setLoading(true);
    await axios
      .post(`${BASE_URL}/api/orders/${orderId}?status=${status}`)
      .then((res) => {getAllOrders()});
    
  };
  return (
    <>
      <Table
        pagination={true}
        loading={loading}
        columns={columns}
        filters={true}
        dataSource={displayedOrders}
      ></Table>
      {isEdit ? (
        <EditModal
          isEdit={isEdit}
          changeStatus={changeStatus}
          record={modalInfo}
          setIsEdit={setIsEdit}
          orderDetail={orderDetail}
        />
      ) : ( 
        ""
      )}
    </>
  );
};

export default AdminOrder;
