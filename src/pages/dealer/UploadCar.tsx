import { useState, useCallback, useRef, useEffect } from "react";
import { Form, Input, Button, Upload, AutoComplete, InputNumber, DatePicker, Radio, Row, Col, Space, Collapse, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { PRIMARY_COLOR } from "../../constants/colors";
import { PROVINCES } from "../../constants/provinces";
import { CAR_COLORS } from "../../constants/carColors";
import { UploadIcon, SearchIcon, CheckIcon } from "../../components/icons/Icons";
import { searchApi, carsApi } from "../../services/api";
import "./UploadCar.css";

interface UploadCarProps {
  carId?: string; // Nếu có carId thì là edit mode
  initialValues?: any; // Giá trị ban đầu cho form (khi edit)
  onSuccess?: () => void; // Callback khi submit thành công
}

export default function UploadCar({ carId, initialValues, onSuccess }: UploadCarProps = {}) {
  const isEditMode = !!carId;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [imagesFieldError, setImagesFieldError] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedCarIds, setSelectedCarIds] = useState<{
    model_year_id?: string;
    trim_id?: string;
    model_id?: string;
    brand_id?: number;
  }>({});
  const selectedCondition = Form.useWatch("condition", form);
  const selectedFuelType = Form.useWatch("fuelType", form);
  const [carSpecs, setCarSpecs] = useState<any>(null);
  const [searchOptions, setSearchOptions] = useState<{ value: string; label: string; car?: any }[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [presignedUrls, setPresignedUrls] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, any>>(new Map());
  const [coverImageUid, setCoverImageUid] = useState<string | undefined>();
  const [colorCollapseActiveKey, setColorCollapseActiveKey] = useState<string | string[]>(["color-select"]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingFilesRef = useRef<Set<string>>(new Set());

  const handleSearch = useCallback(async (value: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value || value.trim().length === 0) {
      setSearchOptions([]);
      setHasSearched(false);
      return;
    }

    // Debounce: wait 300ms before making API call
    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true);
      setHasSearched(true);
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

      // Lưu các ID cần thiết cho API
      setSelectedCarIds({
        model_year_id: car.model_year_id,
        trim_id: car.trim_id,
        model_id: car.model_id,
        brand_id: car.brand_id,
      });

      // Gọi API detail/by-model-year-and-trim
      try {
        const carDetail = await carsApi.getCarDetailByModelYearAndTrim({
          model_year_id: car.model_year_id || "",
          trim_id: car.trim_id || "",
        });
        console.log("Car detail:", carDetail);

        // Lưu thông số kỹ thuật để hiển thị
        setCarSpecs(carDetail);

        // Map màu từ code sang code nếu cần
        let colorCode = carDetail.color;
        if (colorCode) {
          const colorItem = CAR_COLORS.find(
            (c) => c.code === colorCode || c.value === colorCode
          );
          if (colorItem) {
            colorCode = colorItem.code; // Dùng code để lưu trong state
          }
        }

        // Tự động fill form với dữ liệu từ API
        form.setFieldsValue({
          name: option.label,
          displayName: option.label, // Tên hiển thị mặc định bằng tên xe
          year: carDetail.data?.year ? dayjs(`${carDetail.data.year}-01-01`) : undefined,
          mileage: carDetail.data?.mileage,
        });

        // Set màu vào state riêng
        setSelectedColor(colorCode);
      } catch (error) {
        console.error("Error fetching car detail:", error);
      }
    },
    [form]
  );

  // Load dữ liệu khi edit
  useEffect(() => {
    const loadCarData = async () => {
      if (isEditMode && carId) {
        try {
          const carData = await carsApi.getCarById(carId);

          // Map màu từ code sang code nếu cần
          let colorCode = carData.color;
          if (colorCode) {
            const colorItem = CAR_COLORS.find(
              (c) => c.code === colorCode || c.value === colorCode
            );
            if (colorItem) {
              colorCode = colorItem.code; // Dùng code để lưu trong state
            }
          }

          // Transform dữ liệu từ API sang form values
          const formValues = {
            name: carData.name,
            displayName: carData.name,
            year: carData.year ? dayjs(`${carData.year}-01-01`) : undefined,
            mileage: carData.mileage,
            condition: (carData as any).condition,
            fuelType: carData.fuelType,
            priceBillion: carData.price ? Math.floor(carData.price / 1000) : undefined,
            priceMillion: carData.price ? carData.price % 1000 : undefined,
            saleLocation: (carData as any).saleLocation,
            contactPhone: (carData as any).contactPhone,
            conditionDescription: (carData as any).conditionDescription,
          };

          form.setFieldsValue(formValues);
          // Set màu vào state riêng
          setSelectedColor(colorCode);

          // Load images nếu có
          if (carData.images && carData.images.length > 0) {
            const imageList = carData.images.map((url: string, index: number) => ({
              uid: `existing-${index}`,
              name: `image-${index}`,
              status: "done" as const,
              url: url,
              thumbUrl: url,
            }));
            setFileList(imageList);
            // Tự động chọn ảnh đầu tiên làm ảnh bìa
            if (imageList.length > 0) {
              setCoverImageUid(imageList[0].uid);
            }
            imageList.forEach((img) => {
              setUploadedFiles((prev) => new Set(prev).add(img.uid));
            });
          }
        } catch (error) {
          console.error("Error loading car data:", error);
        }
      } else if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    };

    loadCarData();
  }, [isEditMode, carId, form, initialValues]);

  // Tự động chọn ảnh đầu tiên làm ảnh bìa khi có ảnh mới
  useEffect(() => {
    if (fileList.length > 0 && !coverImageUid) {
      // Tìm ảnh đầu tiên có status done hoặc có url
      const firstValidImage = fileList.find(
        (file) => file.status === "done" || file.url
      );
      if (firstValidImage) {
        setCoverImageUid(firstValidImage.uid);
      }
    }
  }, [fileList, coverImageUid]);

  // Helper function để extract UUID từ URL
  const extractUuidFromUrl = (url: string | File): string | File => {
    if (typeof url !== "string") {
      return url; // Nếu là File object, giữ nguyên
    }
    // Lấy phần cuối cùng sau dấu / cuối cùng
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  // Xử lý submit form
  const handleSubmit = async (values: any) => {
    try {
      // Validate selectedCarIds (phải có đầy đủ IDs)
      if (!selectedCarIds.model_year_id || !selectedCarIds.model_id || !selectedCarIds.brand_id) {
        message.error("Vui lòng chọn xe từ danh sách");
        form.setFields([
          {
            name: "name",
            errors: ["Vui lòng chọn xe từ danh sách"],
          },
        ]);
        return;
      }

      // Validate selectedColor
      if (!selectedColor) {
        message.error("Vui lòng chọn màu xe");
        form.setFields([
          {
            name: "color",
            errors: ["Vui lòng chọn màu xe"],
          },
        ]);
        return;
      }

      // Transform form values sang format API
      // Ô tỷ nhân 1000, ô triệu giữ nguyên
      const price = values.priceBillion && values.priceMillion
        ? values.priceBillion * 1000 + values.priceMillion
        : values.priceBillion
          ? values.priceBillion * 1000
          : values.priceMillion
            ? values.priceMillion
            : undefined;

      if (!price || price <= 0) {
        message.error("Vui lòng nhập giá mong muốn hợp lệ");
        return;
      }

      // Map form values sang DTO format
      const submitData: any = {
        // Required IDs
        model_year_id: selectedCarIds.model_year_id,
        trim_id: selectedCarIds.trim_id,
        model_id: selectedCarIds.model_id,
        brand_id: selectedCarIds.brand_id,
        // Car info
        title: values.displayName || values.name, // title từ displayName
        description: values.conditionDescription, // description từ conditionDescription
        fuel: values.fuelType || "gasoline", // fuel từ fuelType
        price: price,
        condition: values.condition,
        odo: values.mileage, // odo từ mileage (giữ nguyên giá trị người dùng nhập)
        year: values.year ? values.year.year() : undefined,
        color: selectedColor, // Lấy màu từ state riêng
        province: values.location, // province từ location
        images: fileList
          .map((file) => {
            const url = file.url || file.originFileObj;
            return url ? extractUuidFromUrl(url) : null;
          })
          .filter(Boolean),
        thumbnail: (() => {
          // Lấy URL của ảnh bìa
          if (coverImageUid) {
            const coverFile = fileList.find(f => f.uid === coverImageUid);
            if (coverFile && (coverFile.url || coverFile.originFileObj)) {
              return extractUuidFromUrl(coverFile.url || coverFile.originFileObj);
            }
          }
          // Nếu không có ảnh bìa, lấy ảnh đầu tiên
          if (fileList.length > 0) {
            const firstFile = fileList[0];
            const url = firstFile.url || firstFile.originFileObj;
            return url ? extractUuidFromUrl(url) : undefined;
          }
          return undefined;
        })(),
        contact_phone: values.contactPhone, // contact_phone từ contactPhone
      };

      if (isEditMode && carId) {
        // Update car
        await carsApi.updateCar({
          id: carId,
          ...submitData,
        });
        message.success("Cập nhật thông tin xe thành công");
      } else {
        // Bán xe ngay - gọi API car-for-sale
        await carsApi.carForSale(submitData);
        message.success("Đăng bán xe thành công");
        // Chuyển sang trang danh sách xe đã đăng
        navigate("/dealer/my-cars");
      }

      // Callback khi thành công
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="upload-car-container">
      <h2>{isEditMode ? "Chỉnh sửa thông tin xe" : "Thông tin xe"}</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Nhập tên xe để chọn"
          name="name"
          style={{ marginBottom: 0 }}
          rules={[
            { required: true, message: "Vui lòng chọn xe" }
          ]}
          required
        >
          <AutoComplete
            options={searchOptions}
            onSearch={handleSearch}
            onSelect={handleSelect}
            notFoundContent={
              searching
                ? "Đang tìm kiếm..."
                : hasSearched && searchOptions.length === 0
                  ? "Không tìm thấy kết quả"
                  : null
            }
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
          className="upload-car-specs-collapse-blue"
          items={[
            {
              key: "1",
              label: <span style={{ color: "#1890ff" }}>Xem thông số kỹ thuật</span>,
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
        />
        <Form.Item
          label="Tên xe hiển thị trên trang chủ"
          name="displayName"
          rules={[
            { required: true, message: "Vui lòng nhập tên xe hiển thị" },
            { max: 200, message: "Tên xe không được vượt quá 200 ký tự" }
          ]}
          required
        >
          <Input placeholder="Nhập tên xe hiển thị trên trang chủ" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          label="Tình trạng xe"
          name="condition"
          initialValue="new"
          rules={[
            { required: true, message: "Vui lòng chọn tình trạng xe" }
          ]}
          required
        >
          <Radio.Group>
            <Space>
              {[
                { value: "new", label: "Mới" },
                { value: "like_new", label: "Lướt" },
                { value: "zin", label: "Zin" },
                { value: "used", label: "Cũ" },
              ].map((item) => {
                const isSelected = selectedCondition === item.value;
                return (
                  <Radio key={item.value} value={item.value} className="custom-radio">
                    <span className="radio-label">{item.label}</span>
                    {isSelected && (
                      <CheckIcon
                        className="radio-check-icon"
                        style={{
                          color: "#fff",
                          width: 12,
                          height: 12,
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </Radio>
                );
              })}
            </Space>
          </Radio.Group>
        </Form.Item>
        {carSpecs && carSpecs.data?.fuel !== "electric" && (
          <Form.Item label="Máy" name="fuelType" initialValue="gasoline">
            <Radio.Group>
              <Space>
                {[
                  { value: "gasoline", label: "Xăng" },
                  { value: "diesel", label: "Dầu" },
                ].map((item) => {
                  const isSelected = selectedFuelType === item.value;
                  return (
                    <Radio key={item.value} value={item.value} className="custom-radio">
                      <span className="radio-label">{item.label}</span>
                      {isSelected && (
                        <CheckIcon
                          className="radio-check-icon"
                          style={{
                            color: "#fff",
                            width: 12,
                            height: 12,
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          </Form.Item>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Năm sản xuất"
              name="year"
              rules={[
                { required: true, message: "Vui lòng chọn năm sản xuất" }
              ]}
              required
            >
              <DatePicker
                picker="year"
                placeholder="Chọn năm sản xuất"
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Odo - số km đã đi (vạn)"
              name="mileage"
              rules={[
                { required: true, message: "Vui lòng nhập số km đã đi" },
                { type: "number", min: 0, message: "Số km phải lớn hơn hoặc bằng 0" }
              ]}
              required
            >
              <InputNumber
                placeholder="Nhập số vạn"
                style={{ width: "100%", borderRadius: 8 }}
                min={0}
                addonAfter="vạn"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Chọn màu xe"
          name="color"
          required
          rules={[
            {
              validator: () => {
                if (!selectedColor) {
                  return Promise.reject(new Error("Vui lòng chọn màu xe"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Collapse
            bordered={false}
            activeKey={colorCollapseActiveKey}
            onChange={(keys) => setColorCollapseActiveKey(keys)}
            items={[
              {
                key: "color-select",
                label: (
                  <span style={{ color: "rgba(0, 0, 0, 0.85)" }}>
                    Chọn màu xe{selectedColor ? `: ${CAR_COLORS.find(c => c.code === selectedColor)?.value || selectedColor}` : ""}
                  </span>
                ),
                children: (
                  <Radio.Group
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      // Đóng Collapse khi đã chọn màu
                      setColorCollapseActiveKey([]);
                      // Clear validation error khi đã chọn màu
                      form.setFields([
                        {
                          name: "color",
                          errors: [],
                        },
                      ]);
                    }}
                  >
                    <Space wrap size={[8, 8]}>
                      {CAR_COLORS.map((item) => {
                        const isSelected = selectedColor === item.code;
                        if (isSelected) {
                          console.log(item);
                        }
                        // Xác định màu icon check dựa trên độ sáng của màu nền
                        const getCheckIconColor = () => {
                          // Màu sáng (trắng, vàng, vàng đồng, be) -> icon đen
                          if (item.code === "white" || item.code === "yellow" || item.code === "bronze" || item.code === "beige") {
                            return "#000000";
                          }
                          // Màu tối -> icon trắng
                          return "#ffffff";
                        };

                        return (
                          <Radio.Button
                            key={item.code}
                            value={item.code}
                            className="color-radio"
                            style={{
                              width: 32,
                              height: 32,
                              padding: 0,
                              backgroundColor: item.color,
                              borderRadius: "50%",


                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title={item.value}
                          >
                            {isSelected && (
                              <CheckIcon
                                style={{
                                  color: getCheckIconColor(),
                                  width: 16,
                                  height: 16,
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              />
                            )}
                          </Radio.Button>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                ),
              },
            ]}
            style={{ borderRadius: 8, marginTop: 0 }}
            className="upload-car-specs-collapse"
          />
        </Form.Item>
        <Form.Item label="Mô tả tình trạng xe, ưu đãi đặc biệt" name="conditionDescription">
          <Input.TextArea
            placeholder="Nhập mô tả tình trạng xe"
            rows={4}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Xe bán tại"
              name="location"
              rules={[
                { required: true, message: "Vui lòng chọn tỉnh/thành phố" }
              ]}
              required
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                style={{ borderRadius: 8 }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={PROVINCES.map((province) => ({
                  value: province.code,
                  label: province.name,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại liên hệ"
              name="contactPhone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại phải có 10-11 chữ số" }
              ]}
              required
            >
              <Input
                placeholder="Nhập số điện thoại"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Giá mong muốn"
          rules={[
            {
              validator: () => {
                const priceBillion = form.getFieldValue("priceBillion");
                const priceMillion = form.getFieldValue("priceMillion");
                if (!priceBillion && !priceMillion) {
                  return Promise.reject(new Error("Vui lòng nhập ít nhất một trong hai: tỷ hoặc triệu"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="priceBillion"
                noStyle
                rules={[
                  { type: "number", min: 0, message: "Giá tỷ phải lớn hơn hoặc bằng 0" }
                ]}
              >
                <InputNumber
                  placeholder="ví dụ: 2"
                  style={{ width: "100%", borderRadius: 8 }}
                  min={0}
                  addonAfter="Tỷ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priceMillion"
                noStyle
                rules={[
                  { type: "number", min: 0, max: 999, message: "Giá triệu phải từ 0 đến 999" }
                ]}
              >
                <InputNumber
                  placeholder="ví dụ: 500"
                  style={{ width: "100%", borderRadius: 8 }}
                  min={0}
                  max={999}
                  addonAfter="Triệu"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="Hình ảnh - click vào ảnh để chọn ảnh bìa"
          name="images"
          valuePropName="fileList"
          required
          rules={[
            {
              validator: (_, value) => {
                // Check cả form value và fileList state
                const currentFileList = value || fileList;

                // Kiểm tra có ít nhất 1 file đã upload thành công (có url hoặc status done)
                const validFiles = currentFileList.filter(
                  (file: any) => file.status === "done" || file.url || (file.response && file.response.url)
                );
                if (validFiles.length === 0) {
                  const errorMsg = "Vui lòng tải lên ít nhất một hình ảnh";
                  setImagesFieldError(errorMsg);
                  return Promise.reject(new Error(errorMsg));
                }
                setImagesFieldError(undefined);
                return Promise.resolve();
              },
            },
          ]}
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            multiple
            listType="picture-card"
            className="upload-car-upload"
            fileList={fileList.map((file) => ({
              ...file,
              className: coverImageUid === file.uid ? "cover-image" : "",
            }))}
            beforeUpload={() => false}
            itemRender={(originNode, file) => {
              const isCover = coverImageUid === file.uid;
              return (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverImageUid(file.uid);
                  }}
                >
                  {originNode}
                  {isCover && (
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "#52c41a",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 500,
                        zIndex: 10,
                      }}
                    >
                      Ảnh bìa
                    </div>
                  )}
                </div>
              );
            }}
            onChange={async (info) => {
              const currentFileList = info.fileList;

              // Lấy các file mới được thêm (chưa upload và chưa đang xử lý)
              const newFiles = currentFileList.filter(
                (file) =>
                  file.originFileObj &&
                  !uploadedFiles.has(file.uid) &&
                  !uploadingFiles.has(file.uid) &&
                  !processingFilesRef.current.has(file.uid)
              );

              if (newFiles.length > 0) {
                // Đánh dấu file đang được xử lý ngay lập tức để tránh xử lý lại
                newFiles.forEach((file) => {
                  processingFilesRef.current.add(file.uid);
                  setUploadingFiles((prev) => new Map(prev).set(file.uid, file));
                });

                try {
                  // Gọi API getPresignedUrl với số lượng ảnh
                  const urls = await carsApi.getPresignedUrl({
                    count: newFiles.length,
                    subfolder: "car-for-sale",
                  });

                  setPresignedUrls(urls);
                  console.log("Presigned URLs:", urls);

                  // Upload từng file lên presigned URL theo thứ tự
                  const uploadedFileList: any[] = [...fileList];
                  const wasEmptyBeforeUpload = fileList.length === 0; // Kiểm tra đây có phải lần upload đầu tiên không

                  for (let i = 0; i < newFiles.length; i++) {
                    const file = newFiles[i];
                    const presignedUrl = urls[i];

                    if (file.originFileObj && presignedUrl) {
                      try {
                        // Upload file lên presigned URL
                        const uploadResponse = await fetch(presignedUrl, {
                          method: "PUT",
                          body: file.originFileObj,
                          headers: {
                            "Content-Type": file.originFileObj.type,
                          },
                        });

                        if (uploadResponse.ok) {
                          console.log(`File ${i + 1} uploaded successfully`);

                          // Tạo URL từ presigned URL (bỏ query params)
                          const fileUrl = presignedUrl.split("?")[0];

                          // Thêm file vào fileList sau khi upload thành công
                          uploadedFileList.push({
                            uid: file.uid,
                            name: file.name,
                            status: "done",
                            url: fileUrl,
                            thumbUrl: URL.createObjectURL(file.originFileObj),
                          });

                          // Cập nhật fileList để hiển thị ảnh
                          setFileList([...uploadedFileList]);
                          // Tự động chọn ảnh đầu tiên làm ảnh bìa nếu đây là lần upload đầu tiên
                          if (wasEmptyBeforeUpload && i === 0) {
                            setCoverImageUid(file.uid);
                          }
                          // Sync với form để validation hoạt động đúng
                          form.setFieldValue("images", [...uploadedFileList]);
                          // Clear validation error nếu có
                          setImagesFieldError(undefined);
                          form.validateFields(["images"]);

                          // Đánh dấu file đã upload và xóa khỏi processing
                          setUploadedFiles((prev) => new Set(prev).add(file.uid));
                          processingFilesRef.current.delete(file.uid);
                          setUploadingFiles((prev) => {
                            const newMap = new Map(prev);
                            newMap.delete(file.uid);
                            return newMap;
                          });
                        } else {
                          //console.error(`Failed to upload file ${i + 1}`);
                          processingFilesRef.current.delete(file.uid);
                          setUploadingFiles((prev) => {
                            const newMap = new Map(prev);
                            newMap.delete(file.uid);
                            return newMap;
                          });
                        }
                      } catch (uploadError) {
                        console.error(`Error uploading file ${i + 1}:`, uploadError);
                        processingFilesRef.current.delete(file.uid);
                        setUploadingFiles((prev) => {
                          const newMap = new Map(prev);
                          newMap.delete(file.uid);
                          return newMap;
                        });
                      }
                    }
                  }
                } catch (error) {
                  console.error("Error getting presigned URLs:", error);
                  // Xóa file khỏi processing và uploadingFiles nếu lỗi
                  newFiles.forEach((file) => {
                    processingFilesRef.current.delete(file.uid);
                    setUploadingFiles((prev) => {
                      const newMap = new Map(prev);
                      newMap.delete(file.uid);
                      return newMap;
                    });
                  });
                }
              }
            }}
            onRemove={(file) => {
              setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
              setUploadedFiles((prev) => {
                const newSet = new Set(prev);
                newSet.delete(file.uid);
                return newSet;
              });
              return true;
            }}
          >
            <div className="upload-car-upload-content">
              <UploadIcon width={20} height={20} />
              <span>Upload</span>
            </div>
          </Upload>
        </Form.Item>
        <div className="upload-car-buttons">
          <Button
            type="primary"
            className="upload-car-button"
            htmlType="submit"
            style={{
              background: PRIMARY_COLOR,
              borderColor: PRIMARY_COLOR,
            }}
          >
            {isEditMode ? "Cập nhật" : "Bán xe ngay"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

