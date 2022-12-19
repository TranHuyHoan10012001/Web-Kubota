import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/CheckOut.css";
import { Context } from "../context";
import { Table } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";

const CheckOut = () => {
  const context = useContext(Context);
  const userContext = context.user;
  const cartContex = context.cartList;
  const [dataRow, setDataRow] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = userContext?.token;
  const navigate = useNavigate();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClickOrder = async (_body, _config) => {
    setIsLoading(true);
    await axios
      .post("http://localhost:5000/api/orders/add/create", _body, _config)
      .then((res) =>
        alert("Order Placed Successfully", res.data.message, "success")
      );
    setIsLoading(false);
    navigate("/introduction", { replace: true });
  };

  const head = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      dataIndex: "money",
      key: "money",
    },
  ];
  useEffect(() => {
    const row = [];
    cartContex.forEach((product, index) => {
      const moneySum = product.obj.price * product.quantity;
      row.push({
        key: index,
        id: product.obj.id,
        name: product.obj.name,
        price: product.obj.price,
        quantity: product.quantity,
        money: moneySum,
      });
    });
    row.push({
      key: "sumAllMoney",
      name: "Tổng tiền",
      money: cartContex.money,
    });
    setDataRow(row);
    console.log("dataRowJson: ", context);
  }, [cartContex]);
  return (
    <div className="row">
      <div className="container-checkout">
        <div className="col-md-7">
          <div className="card-checkout">
            <div className="card-checkout-header">
              <h5>NHẬP THÔNG TIN KHÁCH HÀNG</h5>
            </div>
            <div className="card-checkout-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group mb-6">
                    <label> Họ và Tên</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      defaultValue={
                        userContext ? userContext.userInfo?.userName : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label> Số điện thoại</label>
                    <input
                      type="number"
                      name="phone"
                      className="form-control"
                      defaultValue={
                        userContext ? userContext.userInfo?.phone : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label> Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      defaultValue={
                        userContext ? userContext.userInfo?.email : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label> Địa chỉ</label>
                    <textarea
                      rows="3"
                      name="address"
                      className="form-control"
                      defaultValue={
                        userContext ? userContext.userInfo?.address : ""
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label> Ghi chú</label>
                    <textarea
                      rows="3"
                      name="address"
                      className="form-control"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-5 container-productscreen">
        <div>
          <h5>CHI TIẾT ĐƠN HÀNG</h5>
        </div>
        <Table columns={head} dataSource={dataRow} />
        <div>
          <h6>HÌNH THỨC THANH TOÁN</h6>
          <input
            type="radio"
            id="html"
            name="fav_language"
            value="HTML"
            checked
          />
          <label for="html">Thanh toán khi nhận hàng (COD) </label>
        </div>
        <div className="col-md-12">
          <div className="form-group text-end">
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={() => handleClickOrder(context.order, config)}
              disabled={!token}
            >
              Đặt hàng
            </button>
            {!token && (
              <Modal
                title="Yêu cầu đăng nhập"
                open={!isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>Hãy đăng nhập để đặt hàng</p>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
