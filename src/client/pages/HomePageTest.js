import { faLocation, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-loading";
import logo from "../../image/logo.png";
import HomePage from "./homePage";
import Login from "./Login";
import Nav from "./Nav";
import ProductList from "./Products";
import ProductDetail from "./ProductDetail";
import MachineEngineering from "./machine";
import { ForgotPassword } from "./ForgotPassword";
import RegisterAccount from "./registerAccount";
import About from "./about";
import SingleMachine from "./SingleMachine";
import { Context } from "../context";
import "antd/dist/antd.css";
import CheckOut from "./CheckOut";

import * as _ from "lodash";
import AdminPage from "./admin";

import Cart from "./cart/cart";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    borderBottomStyle: "double",
    padding: "0 150px 20px",
  },
  content: {},
  logo: {},
  info: {
    width: "100%",
  },
  contact: {
    display: "flex",
    justifyContent: "space-around",
  },
  contactLeft: {},
  contactRight: {},
  taskbar: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 20,
  },
  leftTaskbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  navTop: {
    display: "flex",
    gap: 60,
    justifyContent: "center",
  },
  rightTaskbar: {
    display: "flex",
    gap: 20,
  },
  btn: {
    padding: "0 10px",
    backgroundColor: "#267fff",
    color: "#fff",
    border: "none",
  },
}));
const HomePageTest = () => {
  const context = useContext(Context);
  console.log(context.user)
  const navigate = useNavigate();
  const classes = useStyles();
  const handleLoginButton = (event) => {
    event.preventDefault();
    navigate("/login", { replace: true });
  };
  const handleCartButton = (event) => {
    event.preventDefault();
    navigate("/cart", { replace: true });
  };
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.logo}>
          <span>
            <img src={logo} alt="company logo" style={{ width: "70%" }} />
          </span>
        </div>
        <div className={classes.info}>
          <div className={classes.contact}>
            <div className={classes.contactLeft}>
              <FontAwesomeIcon icon={faPhone} /> HOTLINE: 0398.490.986 -
              0949.265.919
            </div>
            <div className={classes.contactRight}>
              <FontAwesomeIcon icon={faLocation} />
              <a href="https://g.page/KubotaBMP?share">
                PH??? T??NG M??Y N??NG NGHI???P KUBOTA
              </a>
            </div>
          </div>
          <div className={classes.taskbar}>
            <div className={classes.navTop}>
              <Nav />
            </div>
            <div className={classes.rightTaskbar}>
              <button className={classes.btn} onClick={handleCartButton}>
                {context.cartList.length === 0
                  ? "Gi??? h??ng"
                  : `Gi??? h??ng(${context.cartList.length})`}
              </button>
              <button className={classes.btn} onClick={handleLoginButton}>
                {!_.isEmpty(context.user)
                  ? `${context.user.userInfo.userName}`
                  : "????NG NH???P"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.content}>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route
            exact
            path="/products/category/:categoryId"
            element={<ProductList></ProductList>}
            loading
          />
          <Route
            exact
            path="/products"
            element={<ProductList></ProductList>}
            loading
          />
          <Route
            exact
            path="/products/details/:productId"
            element={<ProductDetail></ProductDetail>}
            loading
          />
          <Route exact path="/introduction" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<RegisterAccount />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route exact path="/machine" element={<MachineEngineering />} />
          <Route path="/machine/:machineId" element={<SingleMachine />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/CheckOut" element={<CheckOut />} />
          <Route exact path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePageTest;
