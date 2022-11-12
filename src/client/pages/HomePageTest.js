import { faLocation, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import logo from "../../image/logo.png";
import HomePage from "./homePage";
import Nav from "./Nav";
import ProductList from "./ProductList";
import Login from "./Login";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
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
  },
}));
const HomePageTest = () => {
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
                PHỤ TÙNG MÁY NÔNG NGHIỆP KUBOTA
              </a>
            </div>
          </div>
          <div className={classes.taskbar}>
            <div className={classes.navTop}>
              <Nav />
            </div>
            <div className={classes.rightTaskbar}>
              <button onClick={handleCartButton}>GIỎ HÀNG</button>
              <button onClick={handleLoginButton}>ĐĂNG NHẬP</button>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.content}>
        <Routes>
          <Route exact path="/" element={<HomePage />} />

          <Route exact path="/product" element={<ProductList></ProductList>} />

          <Route exact path="/introduction" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/cart" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePageTest;