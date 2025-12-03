import { useState, useCallback, useRef } from "react";
import { Form, Input, Button, Upload, AutoComplete, InputNumber, DatePicker, Radio, Row, Col, Space, Collapse } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PRIMARY_COLOR } from "../../constants/colors";
import { UploadIcon, SearchIcon } from "../../components/icons/Icons";
import { searchApi, carsApi } from "../../services/api";
import "./UploadCar.css";

export default function UploadCar() {
  const [form] = Form.useForm();
  const selectedColor = Form.useWatch("color", form);
  const [carSpecs, setCarSpecs] = useState<any>(null);
  const [searchOptions, setSearchOptions] = useState<{ value: string; label: string; car?: any }[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (value: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value || value.trim().length === 0) {
      setSearchOptions([]);
      return;
    }

    // Debounce: wait 300ms before making API call
    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const result = await searchApi.searchCarModels({
          query: value.trim(),
          limit: 10,
        });
        if (result?.data && result?.data.hits.length > 0) {
          const cars = result.data.hits;
          const options = cars.map((car) => ({
            value: `${car.title}`,
            label: `${car.title}`,
            car,
          }));
          setSearchOptions(options);
        } else {
          setSearchOptions([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchOptions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleSelect = useCallback(
    async (_value: string, option: { value: string; label: string; car?: any }) => {
      if (!option.car) {
        console.warn("Car data not available in option");
        return;
      }

      const car = option.car;

      // Gọi API detail/by-model-year-and-trim
      try {
        const carDetail = await carsApi.getCarDetailByModelYearAndTrim({
          model_year_id: car.model_year_id || "",
          trim_id: car.trim_id || "",
        });
        console.log("Car detail:", carDetail);

        // Lưu thông số kỹ thuật để hiển thị
        setCarSpecs(carDetail);

        // Tự động fill form với dữ liệu từ API
        form.setFieldsValue({
          name: option.label,
          displayName: option.label, // Tên hiển thị mặc định bằng tên xe
          year: carDetail.data?.year ? dayjs(`${carDetail.data.year}-01-01`) : undefined,
          color: carDetail.color,
          mileage: carDetail.data?.mileage,
        });
      } catch (error) {
        console.error("Error fetching car detail:", error);
      }
    },
    [form]
  );

  return (
    <div className="upload-car-container">
      <h2>Thông tin xe</h2>
      <Form form={form} layout="vertical">
        <Form.Item label="Nhập tên xe để chọn" name="name" style={{ marginBottom: 0 }}>
          <AutoComplete
            options={searchOptions}
            onSearch={handleSearch}
            onSelect={handleSelect}
            notFoundContent={searching ? "Đang tìm kiếm..." : "Không tìm thấy kết quả"}
            style={{ borderRadius: 8 }}
            filterOption={false}
            allowClear
          >
            <Input
              placeholder="Tìm kiếm tên xe, ví dụ: Toyota Vios 2019"
              prefix={
                <SearchIcon
                  width={16}
                  height={16}
                  style={{ color: "rgba(0,0,0,0.45)" }}
                />
              }
              style={{ borderRadius: 8 }}
            />
          </AutoComplete>
        </Form.Item>
        <Collapse
          bordered={false}
          items={[
            {
              key: "1",
              label: <span style={{}}>Xem thông số kỹ thuật</span>,
              children: carSpecs ? (
                <div style={{ padding: "4px 0" }}>
                  <Row gutter={[16, 8]}>
                    {carSpecs.engine && (
                      <Col span={12}>
                        <div>
                          <strong>Động cơ:</strong> {carSpecs.engine}
                        </div>
                      </Col>
                    )}
                    {carSpecs.transmission && (
                      <Col span={12}>
                        <div>
                          <strong>Hộp số:</strong> {carSpecs.transmission}
                        </div>
                      </Col>
                    )}
                    {carSpecs.fuelType && (
                      <Col span={12}>
                        <div>
                          <strong>Nhiên liệu:</strong> {carSpecs.fuelType}
                        </div>
                      </Col>
                    )}
                    {carSpecs.seats && (
                      <Col span={12}>
                        <div>
                          <strong>Số chỗ ngồi:</strong> {carSpecs.seats}
                        </div>
                      </Col>
                    )}
                    {carSpecs.power && (
                      <Col span={12}>
                        <div>
                          <strong>Công suất:</strong> {carSpecs.power}
                        </div>
                      </Col>
                    )}
                    {carSpecs.torque && (
                      <Col span={12}>
                        <div>
                          <strong>Mô men xoắn:</strong> {carSpecs.torque}
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              ) : (
                <div style={{ padding: "4px 0", color: "#999" }}>
                  Vui lòng chọn xe để xem thông số kỹ thuật
                </div>
              ),
            },
          ]}
          style={{ borderRadius: 8, marginTop: 4, marginBottom: 16 }}
          className="upload-car-specs-collapse"
        />
        <Form.Item label="Tên xe hiển thị trên trang chủ" name="displayName">
          <Input placeholder="Nhập tên xe hiển thị trên trang chủ" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item label="Tình trạng xe" name="condition">
          <Radio.Group>
            <Radio value="new">Mới</Radio>
            <Radio value="like_new">Lướt</Radio>
            <Radio value="zin">Zin</Radio>
            <Radio value="used">Cũ</Radio>
          </Radio.Group>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Năm sản xuất" name="year">
              <DatePicker
                picker="year"
                placeholder="Chọn năm sản xuất"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Số vạn km đã đi (Odo)" name="mileage">
              <InputNumber
                placeholder="Nhập số vạn"
                style={{ width: "100%", borderRadius: 8 }}
                min={0}
                addonAfter="vạn"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Màu sắc" name="color">
          <Radio.Group>
            <Space wrap size={[8, 8]}>
              {[
                { value: "Trắng", color: "#FFFFFF", border: "#d9d9d9" },
                { value: "Đen", color: "#000000" },
                { value: "Bạc", color: "#C0C0C0" },
                { value: "Xám", color: "#808080" },
                { value: "Xanh dương", color: "#0066CC" },
                { value: "Xanh lá", color: "#00CC66" },
                { value: "Đỏ", color: "#CC0000" },
                { value: "Vàng", color: "#FFCC00" },
                { value: "Cam", color: "#FF6600" },
              ].map((item) => {
                const isSelected = selectedColor === item.value;
                // Xác định màu icon check dựa trên độ sáng của màu nền
                const getCheckIconColor = () => {
                  // Màu sáng (trắng, vàng, vàng đồng) -> icon đen
                  if (item.value === "Trắng" || item.value === "Vàng" || item.value === "Vàng đồng") {
                    return "#000000";
                  }
                  // Màu tối -> icon trắng
                  return "#ffffff";
                };

                return (
                  <Radio.Button
                    key={item.value}
                    value={item.value}
                    style={{
                      width: 32,
                      height: 32,
                      padding: 0,
                      backgroundColor: item.color,
                      borderColor: isSelected ? "#52c41a" : (item.border || item.color),
                      borderWidth: isSelected ? 3 : 1,
                      borderRadius: "50%",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                      boxShadow: isSelected
                        ? "0 0 0 2px rgba(82, 196, 26, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)"
                        : "0 1px 2px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title={item.value}
                    disabled={false}
                  >
                    {isSelected && (
                      <CheckOutlined
                        style={{
                          color: getCheckIconColor(),
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </Radio.Button>
                );
              })}
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Mô tả tình trạng xe" name="conditionDescription">
          <Input.TextArea
            placeholder="Nhập mô tả tình trạng xe"
            rows={4}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item label="Giá mong muốn" name="price">
          <InputNumber
            placeholder="Nhập số tiền"
            style={{ width: "100%", borderRadius: 8 }}
            min={0}
            addonAfter="VNĐ"
          />
        </Form.Item>
        <Form.Item
          label="Hình ảnh"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload multiple listType="picture-card" className="upload-car-upload">
            <div className="upload-car-upload-content">
              <UploadIcon width={20} height={20} />
              <span>Upload</span>
            </div>
          </Upload>
        </Form.Item>
        <div className="upload-car-buttons">
          <Button
            type="default"
            className="upload-car-button upload-car-button-save"
          >
            Lưu lại
          </Button>
          <Button
            type="primary"
            className="upload-car-button"
            style={{
              background: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
          >
            Bán xe ngay
          </Button>
        </div>
      </Form>
    </div>
  );
}

