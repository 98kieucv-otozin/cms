import { useState, useCallback, useRef } from "react";
import { Form, Input, Button, Upload, AutoComplete } from "antd";
import { PRIMARY_COLOR } from "../../constants/colors";
import { UploadIcon, SearchIcon } from "../../components/icons/Icons";
import { searchApi } from "../../services/api";
import type { Car } from "../../services/api/types";
import "./UploadCar.css";

export default function UploadCar() {
  const [searchOptions, setSearchOptions] = useState<{ value: string; label: string; car?: Car }[]>([]);
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
        if (result?.data.data && result?.data.data.hits.length > 0) {
          const cars = result.data.data.hits;
          const options = cars.map((car) => ({
            value: car.id,
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

  return (
    <div className="upload-car-container">
      <h2>Thông tin xe</h2>
      <Form layout="vertical">
        <Form.Item label="Tên xe" name="name">
          <AutoComplete
            options={searchOptions}
            onSearch={handleSearch}
            notFoundContent={searching ? "Đang tìm kiếm..." : "Không tìm thấy kết quả"}
            style={{ borderRadius: 8 }}
            filterOption={false}
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
        <Form.Item label="Giá mong muốn" name="price">
          <Input placeholder="Nhập số tiền" />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="images">
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

