import React, { useContext, useState } from "react";
import { makeStyles } from "@mui/styles";
// import { Form, Button } from "react-bootstrap";
import "../css/login.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { email } from "ra-core";
import { Context } from "../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../apiConfig";
import { Alert } from "antd";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: "77vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
}));

const Login = () => {
  const context = useContext(Context);
  const navigate = useNavigate();

  const goHomePage = () => {
    navigate("/");
  };

  const [inputtext, setinputtext] = useState({
    email: "",
    password: "",
  });

  const [warnemail, setwarnemail] = useState(false);
  const [warnpassword, setwarnpassword] = useState(false);
  const [statusCode, setStatusCode] = useState(null);

  const [eye, seteye] = useState(true);
  const [password, setpassword] = useState("password");
  const [type, settype] = useState(false);

  const params = new URLSearchParams();
  params.append("email", inputtext.email);
  params.append("password", inputtext.password);

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const inputEvent = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setinputtext((lastValue) => {
      return {
        ...lastValue,
        [name]: value,
      };
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setwarnemail(false);
    setwarnpassword(false);
    if (inputtext.email === "") {
      setwarnemail(true);
    } else if (inputtext.password === "") {
      setwarnpassword(true);
    } else {
      console.log(email);
      await axios
        .post(`${BASE_URL}/api/users/login`, params, config)
        .then((res) => {
          if (res.status === 200) {
            context.setUser({
              userInfo: res.data.user,
              token: res.data.accessToken,
            });
            goHomePage();
          }
        })
        .catch((err) => setStatusCode(err.response.status));
    }
  };

  console.log("status: ", statusCode);
  const Eye = () => {
    if (password === "password") {
      setpassword("text");
      seteye(false);
      settype(true);
    } else {
      setpassword("password");
      seteye(true);
      settype(false);
    }
  };
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className="card" style={{ height: 500 }}>
        <div className="text">
          <h2>????ng nh???p t??i kho???n</h2>{" "}
          <p>
            Nh???p th??ng tin ????ng nh???p c???a b???n ????? truy c???p v??o t??i kho???n c???a b???n.
          </p>
        </div>
        <form onSubmit={(e) => submitForm(e)}>
          <div className="input-text">
            <input
              type="text"
              className={` ${warnemail ? "warning" : ""}`}
              placeholder="Enter your email"
              value={inputtext.email}
              onChange={inputEvent}
              name="email"
            />
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          {warnemail && (
            <div style={{ color: "red", marginLeft: 5 }}>
              Vui l??ng nh???p email
            </div>
          )}
          <div className="input-text">
            <input
              type={password}
              className={` ${warnpassword ? "warning" : ""} ${
                type ? "type_password" : ""
              }`}
              placeholder="Enter your password"
              value={inputtext.password}
              onChange={inputEvent}
              name="password"
            />
            <FontAwesomeIcon icon={faLock} />
            <FontAwesomeIcon onClick={Eye} icon={eye ? faEye : faEyeSlash} />
          </div>
          {warnpassword && (
            <div style={{ color: "red", marginLeft: 5 }}>
              Vui l??ng nh???p m???t kh???u
            </div>
          )}
          {statusCode === 400 && (
            <Alert
              style={{ marginTop: 10 }}
              message="Email ho???c m???t kh???u kh??ng ch??nh x??c. Vui l??ng th??? l???i"
              type="error"
            />
          )}
          <div className="buttons">
            <button type="submit">Sign in</button>
          </div>
          <div className="forgot">
            <p>
              B???n c???n ?????i m???t kh???u?{" "}
              <Link to="/forgotPassword">Thay ?????i m???t kh???u</Link>
            </p>
          </div>
          <div className="register">
            <p style={{ marginRight: "5px" }}>B???n ch??a c?? t??i kho???n?</p>
            <Link to="/register">????ng k?? t??i kho???n</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
