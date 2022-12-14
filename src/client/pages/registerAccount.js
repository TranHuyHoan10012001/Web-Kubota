import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import "../css/register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input, notification, Space } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FrownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { BASE_URL } from "../../apiConfig";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  inputForm: {
    display: "flex",
    flexDirection: "column",
  },
}));
const RegisterAccount = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [warmingPassword, setWarningPassword] = useState(null);
  const [wrongFormatPassword, setWrongFormatPassword] = useState(null);
  const [checkAll, setCheckAll] = useState(false);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const params = new URLSearchParams();
  params.append("userName", name);
  params.append("email", email);
  params.append("phone", phone);
  params.append("password", password);
  params.append("address", address);

  const submitForm = async (e) => {
    e.preventDefault();
    await axios
      .post(`${BASE_URL}/api/users/register`, params, config)
      .then((res) => {
        const key = `open${Date.now()}`;
        const btn = (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                navigate("/login", { replace: true });
                api.destroy(key);
              }}
            >
              ??i t???i ????ng nh???p
            </Button>
          </Space>
        );
        console.log("res: ", res);
        res.data.message &&
          checkAll &&
          notification.open({
            message: "Th??ng b??o",
            description: "Thay ?????i m???t kh???u th??nh c??ng",
            btn,
            key,
            icon: (
              <SmileOutlined
                style={{
                  color: "#108ee9",
                }}
              />
            ),
          });
        !res.data.message &&
          notification.open({
            message: "Th??ng b??o",
            description: `????ng k?? t??i kho???n kh??ng th??nh c??ng. ${res.data}`,
            icon: (
              <FrownOutlined
                style={{
                  color: "red",
                }}
              />
            ),
          });
        !checkAll &&
          notification.open({
            message: "Th??ng b??o",
            description: `????ng k?? t??i kho???n kh??ng th??nh c??ng. Vui l??ng ??i???n ?????y ????? th??ng tin`,
            icon: (
              <FrownOutlined
                style={{
                  color: "red",
                }}
              />
            ),
          });
      });
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleChangeConfirmPwd = (event) => {
    setConfirmPwd(event.target.value);
  };
  const handleChangePhone = (event) => {
    setPhone(event.target.value);
  };
  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  useEffect(() => {
    if (password !== confirmPwd) setWarningPassword(true);
    else setWarningPassword(false);
  }, [password, confirmPwd]);

  useEffect(() => {
    if (!validateEmail(email)) setWrongFormatPassword(true);
    else setWrongFormatPassword(false);
  }, [email]);

  useEffect(() => {
    if (!name || !email || !password || !address || !phone) {
      setCheckAll(false);
    } else {
      setCheckAll(true);
    }
  }, [name, email, password, address, phone]);

  return (
    <div className={classes.container}>
      <h3>????NG K?? T??I KHO???N</h3>
      <form onSubmit={(e) => submitForm} style={{ width: "400px" }}>
        <div className={classes.inputForm}>
          <label for="name">
            <b>T??n</b>
          </label>
          <Space>
            <Input
              placeholder="Vui l??ng nh???p name"
              value={name}
              onChange={handleChangeName}
              required
            />
          </Space>
        </div>
        <div className={classes.inputForm}>
          <label for="email">
            <b>Email</b>
          </label>
          <Space>
            <Input
              placeholder="Vui l??ng nh???p email"
              value={email}
              onChange={handleChangeEmail}
            />
          </Space>
          {email && wrongFormatPassword && (
            <Alert message="Email kh??ng h???p l???" type="error" />
          )}
        </div>

        <div className={classes.inputForm}>
          <label for="pw">
            <b>M???t kh???u</b>
          </label>
          <Space>
            <Input.Password
              placeholder="Vui l??ng nh???p m???t kh???u"
              value={password}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={handleChangePassword}
            />
          </Space>
        </div>
        <div className={classes.inputForm}>
          <label for="pw-confirm">
            <b>X??c minh m???t kh???u</b>
          </label>
          <Space>
            <Input.Password
              placeholder="Vui l??ng x??c minh m???t kh???u"
              value={confirmPwd}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={handleChangeConfirmPwd}
            />
          </Space>
          {warmingPassword && (
            <Alert
              style={{ marginTop: 10 }}
              message="Kh??ng tr??ng kh???p v???i m???t kh???u"
              type="error"
            />
          )}
        </div>

        <div className={classes.inputForm}>
          <label for="address">
            <b>?????a ch???</b>
          </label>
          <Space>
            <Input
              placeholder="Vui l??ng nh???p ?????a ch???"
              value={address}
              onChange={handleChangeAddress}
            />
          </Space>
        </div>
        <div className={classes.inputForm}>
          <label for="phone">
            <b>S??? ??i???n tho???i</b>
          </label>
          <Space>
            <Input
              type="number"
              placeholder="Vui l??ng nh???p s??? ??i???n tho???i"
              value={phone}
              onChange={handleChangePhone}
            />
          </Space>
        </div>
      </form>
      <div className="buttons">
        {contextHolder}
        <button
          type="submit"
          disabled={!checkAll}
          onClick={(e) => {
            submitForm(e);
          }}
          style={{ padding: "0px 30px", fontSize: "20px" }}
        >
          ????ng k?? t??i kho???n
        </button>
      </div>
      {!checkAll && (
        <Alert
          style={{ marginTop: 10 }}
          message="Vui l??ng ??i???n ?????y ????? th??ng tin"
          type="error"
        />
      )}
    </div>
  );
};

export default RegisterAccount;
