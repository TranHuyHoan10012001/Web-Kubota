import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
  InputNumber,
  Space,
  Modal,
  Upload,
  message,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

import axios from "axios";
import { LoadingContext } from "react-router-loading";
import { BASE_URL } from "../../../../apiConfig";
import FormData from "form-data";
import { faL } from "@fortawesome/free-solid-svg-icons";

const EditableContext = React.createContext(null);

const checkPNG = {
  beforeUpload: (file) => {
    const isPNG = file.type === "image/png";
    if (!isPNG) {
      message.error(`${file.name} is not a png file`);
    }
    return false;
  },
  onChange: (info) => {
    console.log(info.fileList);
  },
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App = () => {
  const [form] = Form.useForm();
  const [addProductForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const loadingContext = useContext(LoadingContext);
  const [autoComplete, setAutoComplete] = useState([{}]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [isAddProduct, setIsAddProduct] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const [count, setCount] = useState(2);

  const getAllProds = async () => {
    await axios
      .get(`${BASE_URL}/api/products/alltest`)
      .then(async (allData) => {
        const autoCmpData = allData.data.allProducts.map((item) => {
          return { value: item.name, label: item.name, ...item };
        });
        setAutoComplete(autoCmpData);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoadingStatus(false);
      });
  };

  const handleDelete = async (key, productId) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    await axios
      .delete(`${BASE_URL}/api/products/${productId}`)
      .then((response) => console.log("Delete successful"));
  };

  const handleProductChange = async (item) => {
    await axios
      .post(`${BASE_URL}/api/products/${item.id}`, item, {
        "Content-Type": "text/plain",
      })
      .then((res) => {
        <Modal>Th??nh c??ng</Modal>;
      });
  };

  const handleAdd = async (val) => {
    console.log(val);
    setLoadingStatus(true);
    const formData = new FormData();
    formData.append("name", val.name);
    formData.append("description", val.description);
    formData.append("price", val.price);
    formData.append("quantityInStock", val.quantityInStock);
    formData.append("image", val.image.file);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    for (const value of formData.values()) {
      console.log(value);
    }

    await axios
      .post(`${BASE_URL}/api/products/addProduct/add`, formData, config)
      .then((res) => {
        setIsAddProduct(false);
        getAllProds();
        setTimeout(() => {
          setLoadingStatus(false);
        }, 1000);
      })
      .catch((err) => {
        console.warn(err.response.data);
      });

    // setDataSource([...dataSource, newData]);
    // setCount(count + 1);
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      description: "",
      price: "",
      quantityInStock: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key, id) => {
    try {
      let row = await form.validateFields();
      row = { id: id, ...row };
      handleProductChange(row);
      console.log(id);
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  useEffect(() => {
    getAllProds();
  }, []);

  useEffect(() => {
    const dataRow = [];
    autoComplete.forEach((product, index) => {
      dataRow.push({
        key: index,
        id: product.id,
        name: product.name,
        description: product.description,
        price: Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.price),
        quantityInStock: product.quantityInStock,
      });
    });
    setDataSource(dataRow);
  }, [autoComplete]);
  // console.log("autoComplete: ", autoComplete);
  const defaultColumns = [
    {
      title: "id",
      dataIndex: "id",
      // editable: true,
    },
    {
      title: "T??n s???n ph???m",
      dataIndex: "name",
      width: "30%",
      filters: [
        {
          text: "M???t b??ch",
          value: "M???t b??ch",
        },
        {
          text: "B??? Van",
          value: "B??? Van",
        },
        {
          text: "D??y ??ai",
          value: "D??Y ??AI",
        },
        {
          text: "B??? c???u ch??",
          value: "B??? c???u ch??",
        },
        {
          text: "D??y curoa",
          value: "D??y curoa",
        },
        {
          text: "Nh???t",
          value: "Nh???t",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
      editable: true,
    },
    {
      title: "M?? t???",
      dataIndex: "description",
      width: "20%",
      editable: true,
    },
    {
      title: "S??? l?????ng trong kho",
      dataIndex: "quantityInStock",
      editable: true,
      sorter: {
        compare: (a, b) => a.id - b.id,
        multiple: 3,
      },
    },
    {
      title: "Gi??",
      dataIndex: "price",
      editable: true,
      sorter: {
        compare: (a, b) =>
          a.price.length - b.price.length &&
          a.price.toLowerCase().localeCompare(b.price.toLowerCase()),
        multiple: 3,
      },
    },
    {
      title: "H??nh ?????ng",
      width: "20%",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key, record.id)}
              style={{
                marginRight: 8,
              }}
            >
              L??u
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>H???y</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 12 }}
            >
              S???a
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => handleDelete(record.key, record.id)}
            >
              X??a
            </Typography.Link>
          </>
        );
      },
    },
  ];

  const components = {
    body: {
      // row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        // inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <Button
        onClick={() => {
          setIsAddProduct(true);
        }}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Th??m s???n ph???m
      </Button>
      {isAddProduct ? (
        <Modal
          title="Ch???nh s???a ????n h??ng"
          visible={isAddProduct}
          // okText="Th??m s???n ph???m"
          // width={1200}
          onCancel={() => {
            setIsAddProduct(false);
          }}
          // onOk={() => {
          //   // console.
          //   handleAdd();
          // }}
          footer={[]} //this to hide the default inputs of the modal
        >
          <Form form={addProductForm} onFinish={handleAdd}>
            <Form.Item
              label="T??n s???n ph???m"
              name="name"
              rules={[
                {
                  required: true,
                  message: "????y l?? d??? li???u b???t bu???c",
                },
              ]}
            >
              <Input placeholder="T??n s???n ph???m" />
            </Form.Item>
            <Form.Item
              label="M?? t???"
              name="description"
              rules={[
                {
                  required: true,
                  message: "????y l?? d??? li???u b???t bu???c",
                },
              ]}
            >
              <Input placeholder="m?? t???" />
            </Form.Item>
            <Form.Item
              label="Gi??"
              name="price"
              rules={[
                {
                  pattern: new RegExp(/^\d*[1-9]+\d*$/),
                  required: true,
                  message: "????y l?? d??? li???u b???t bu???c",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="S??? l?????ng"
              name="quantityInStock"
              rules={[
                {
                  required: true,
                  pattern: new RegExp(/^\d*[1-9]+\d*$/),
                  message: "????y l?? d??? li???u b???t bu???c",
                },
              ]}
            >
              <Input placeholder="m?? t???" />
            </Form.Item>
            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                  message: "????y l?? d??? li???u b???t bu???c",
                },
              ]}
            >
              <Upload {...checkPNG} maxCount={1}>
                <Button icon={<UploadOutlined />}>???nh S???n ph???m</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button key="submit" type="primary" htmlType="submit">
                Th??m s???n ph???m
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        ""
      )}
      <Form form={form} component={false}>
        <Table
          components={components}
          // columns={mergedColumns}
          loading={loadingStatus}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </Form>
    </div>
  );
};
export default App;
