import { Form, Input, Button, Upload } from "antd";
import { PRIMARY_COLOR } from "../../constants/colors";
import { UploadIcon, SearchIcon } from "../../components/icons/Icons";
import "./UploadCar.css";

export default function UploadCar() {
  return (
    <div className="upload-car-container">
      <h2>Thông tin xe</h2>
      <Form layout="vertical">
        <Form.Item label="Tên xe" name="name">
          <Input
            placeholder="Ví dụ: Toyota Vios 2019"
            prefix={
              <SearchIcon
                width={16}
                height={16}
                style={{ color: "rgba(0,0,0,0.45)" }}
              />
            }
            style={{ borderRadius: 8 }}
          />
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

