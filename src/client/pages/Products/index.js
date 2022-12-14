import "antd/dist/antd.min.css";
import React, { useContext, useEffect, useState } from "react";
import * as queryString from "query-string";
import * as _ from "lodash";

import "./index.css";
// import 'antd/dist/antd.less';
import GridView from "./GridView";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { BackTop, Button, Col, Empty, Row } from "antd";
import axios from "axios";
import { BsChevronDoubleUp } from "react-icons/bs";

import ListView from "./ListView";
import LeftPanel from "./CategoryPanel";
import TopMenu from "./TopMenu";

import { Context } from "../../context";
import { LoadingContext } from "react-router-loading";
import { BASE_URL } from "../../../apiConfig";

const ProductList = () => {
  const context = useContext(Context);

  const loadingContext = useContext(LoadingContext);
  const { categoryId } = useParams();
  const currentSearchParams = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const addToCartProduct = {};

  const [products, setProducts] = useState([{}]);
  const [category, setCategory] = useState([{}]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [autoComplete, setAutoComplete] = useState([{}]);
  const [gridView, setGridView] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const addToCart = async (addToCartProduct) => {
    //chưa có thì thêm vào
    await context.addToCart(addToCartProduct);
    // console.log(cartContext.cartList)
    // cartContext.setCartList([addToCartProduct, ...context.cartList]);
  };

  //gọi api ở chuyển router *** chỉ gọi 1 lần ***
  const fetchInitializeData = async (categoryDataCall, autoCmpDataCall) => {
    return await axios.all([categoryDataCall, autoCmpDataCall]);
  };

  useEffect(() => {
    let apiUrls = [
      `${BASE_URL}/api/categories/alltest`,
      // "http://localhost:5000/product/pagetest/1",
      `${BASE_URL}/api/products/alltest`,
    ];

    const categoryDataCall = axios.get(apiUrls[0]);
    // const productsDataCall = axios.get(apiUrls[1]);
    const autoCmpDataCall = axios.get(apiUrls[1]);

    fetchInitializeData(categoryDataCall, autoCmpDataCall)
      .then(
        axios.spread((...allData) => {
          console.log("fetch ", allData);
          const categoryData = allData[0].data.categories;
          // const productsData = allData[1].data;
          const autoCmpData = allData[1].data.allProducts.map((item) => {
            return { value: item.name, label: item.name, ...item };
          });
          //
          //
          setCategory(categoryData);

          setAutoComplete(autoCmpData);
        })
      )
      .catch((err) => console.log(err))
      .finally(() => {
        setLoadingStatus(false);
      });
    setTimeout(() => loadingContext.done(), 1000);
  }, []);

  const fetchChange = async (categoryId) => {
    //lấy chỉ trang từ search params **page=?**
    const page =
      searchParams.get("page") === null ? 1 : searchParams.get("page");
    setCurrentPage(page);

    //output: categoryId=?&sort_by=?
    const query = queryString.stringify(
      { categoryId: categoryId, sort_by: searchParams.get("sort_by") },
      { skipNull: true }
    );
    return await axios.get(
      `${BASE_URL}/api/products/pagetest/${page}?` + query
    );
  };

  //call api khi chuyển cate
  useEffect(() => {
    setLoadingStatus(true);
    setTimeout(() => {
      fetchChange(categoryId)
        .then((res) => {
          console.log("fetch again");
          setProducts(res.data.products);
          setTotalPage(res.data.total);
        })
        .finally(() => setLoadingStatus(false));
    }, 1000);
  }, [categoryId, searchParams]);

  // set loading về false sau khi setGridView xong
  useEffect(() => {
    setLoadingStatus(false);
  }, [gridView]);

  //tạo query params mới khi chuyển trang
  const onPageChange = (page) => {
    const newQuery = queryString.parse(currentSearchParams.search);
    setSearchParams({ ...newQuery, page: page });
  };

  const onFilterChange = (option) => {
    const queryParams = queryString.parse(currentSearchParams.search);
    const newQuery = { ...queryParams, sort_by: option };

    console.log(
      `${currentSearchParams.pathname}` + "?" + queryString.stringify(newQuery)
    );
    navigate({
      pathname: currentSearchParams.pathname,
      search: "?" + queryString.stringify(newQuery),
    });
  };

  const onSelect = (value) => {
    const productId = _.find(autoComplete, { name: value }).id;
    navigate({
      pathname: `/products/details/${productId}`,
    });
  };

  console.log(products);

  if (_.isEmpty(products)) {
    return (
      <>
        <Empty />
      </>
    );
  }

  return (
    <>
      <Row>
        <Col id="left=panel" flex="20%">
          <LeftPanel category={category}></LeftPanel>
        </Col>
        <Col
          id="right-panel"
          flex="auto"
          style={{
            marginTop: "24px",
          }}
        >
          <TopMenu
            currentPage={currentPage}
            currentSearchParams={currentSearchParams}
            autoCmp={autoComplete}
            gridView={gridView}
            setGridView={setGridView}
            setLoadingStatus={setLoadingStatus}
            onFilterChange={onFilterChange}
            onSelect={onSelect}
          />
          <Row>
            <>
              {gridView ? (
                <GridView
                  products={products}
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onPageChange={onPageChange}
                  addToCart={addToCart}
                  itemObj={addToCartProduct}
                  loadingStatus={loadingStatus}
                />
              ) : (
                <ListView
                  products={products}
                  currentPage={currentPage}
                  totalPage={totalPage}
                  onPageChange={onPageChange}
                  addToCart={addToCart}
                  itemObj={addToCartProduct}
                  loadingStatus={loadingStatus}
                />
              )}
            </>
          </Row>
        </Col>
      </Row>
      <BackTop>
        <Button
          type="primary"
          style={{
            borderRadius: "50%",
            height: "50px",
            width: "50px",
            backgroundColor: "green",
          }}
        >
          <BsChevronDoubleUp></BsChevronDoubleUp>
        </Button>
      </BackTop>
    </>
  );
};

export default ProductList;
