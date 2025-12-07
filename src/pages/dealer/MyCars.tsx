import { useState, useEffect } from "react";
import { Table, Card, Image, Tag, Space, Button, message, Row, Col, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { carsApi } from "../../services/api";
import type { Car } from "../../services/api/types";
import "./MyCars.css";

const { Text, Title } = Typography;

export default function MyCars() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchCars = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await carsApi.searchCarForSale({
        page,
        limit,
      });
      setCars(response.hits || []);
      setPagination({
        current: response.page || page,
        pageSize: response.per_page || limit,
        total: response.found || 0,
      });
    } catch (error) {
      console.error("Error fetching cars:", error);
      message.error("Không thể tải danh sách xe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("MyCars component mounted, fetching cars...");
    fetchCars();
    console.log("Cars:", cars);
  }, []);

  const handleTableChange = (page: number, pageSize: number) => {
    fetchCars(page, pageSize);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      const billion = Math.floor(price / 1000);
      const million = price % 1000;
      if (million > 0) {
        return `${billion} tỷ ${million} triệu`;
      }
      return `${billion} tỷ`;
    }
    return `${price} triệu`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      case "sold":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Từ chối";
      case "sold":
        return "Đã bán";
      default:
        return "Chưa xác định";
    }
  };

  const columns: ColumnsType<Car> = [
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      width: 120,
      render: (thumbnail: string) => {
        return (
          <Image
            src={`https://media.otozin.vn/car-for-sale/${thumbnail}`}
            alt="Car"
            width={80}
            height={60}
            style={{ objectFit: "cover", borderRadius: 4 }}
            preview={false}
          />
        );
      },
    },
    {
      title: "Tên xe",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "-",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (price ? formatPrice(price) : "-"),
    },
    {
      title: "Năm sản xuất",
      dataIndex: "year",
      key: "year",
      render: (year: number) => year || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/dealer/upload?carId=${record.id}`)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px" }}>
      <Title level={2} style={{ marginBottom: 16, fontSize: 20 }}>
        Xe đã đăng
      </Title>

      {/* Mobile View - Card Layout */}
      <div style={{ display: "block" }} className="mobile-cars-view">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>Đang tải...</div>
        ) : cars.length === 0 ? (
          <Card>
            <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
              Chưa có xe nào được đăng
            </div>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {cars.map((car) => {
              const imageUrl =
                car.thumbnail
                  ? `https://media.otozin.vn/car-for-sale/${car.thumbnail}`
                  : null;

              return (
                <Col xs={24} sm={12} lg={8} xl={6} key={car.id}>
                  <Card
                    hoverable
                    style={{ borderRadius: 8 }}
                    cover={
                      imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={(car as any).title || car.name || "Car"}
                          height={180}
                          style={{ objectFit: "cover" }}
                          preview={false}
                        />
                      ) : (
                        <div
                          style={{
                            height: 180,
                            background: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                          }}
                        >
                          Không có ảnh
                        </div>
                      )
                    }
                    actions={[
                      <Button
                        type="link"
                        block
                        onClick={() => navigate(`/dealer/upload?carId=${car.id}`)}
                      >
                        Chỉnh sửa
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Text strong style={{ fontSize: 16 }}>
                          {(car as any).title || car.name || "-"}
                        </Text>
                      }
                      description={
                        <div style={{ marginTop: 8 }}>
                          <div style={{ marginBottom: 4 }}>
                            <Text type="secondary">Giá: </Text>
                            <Text strong style={{ color: "#ff4d4f", fontSize: 16 }}>
                              {car.price ? formatPrice(car.price) : "-"}
                            </Text>
                          </div>
                          {car.year && (
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">Năm: </Text>
                              <Text>{car.year}</Text>
                            </div>
                          )}
                          <div>
                            <Tag color={getStatusColor(car.status)}>
                              {getStatusLabel(car.status)}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Pagination for Mobile */}
        {cars.length > 0 && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Space>
              <Button
                disabled={pagination.current === 1}
                onClick={() => handleTableChange(pagination.current - 1, pagination.pageSize)}
              >
                Trước
              </Button>
              <Text>
                Trang {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
              </Text>
              <Button
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => handleTableChange(pagination.current + 1, pagination.pageSize)}
              >
                Sau
              </Button>
            </Space>
            <div style={{ marginTop: 8, color: "#999", fontSize: 12 }}>
              Tổng {pagination.total} xe
            </div>
          </div>
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div style={{ display: "none" }} className="desktop-cars-view">
        <Card>
          <Table
            columns={columns}
            dataSource={cars}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} xe`,
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
