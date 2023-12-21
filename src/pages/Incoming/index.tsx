import { LoadingOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function InComing() {
  const navigate = useNavigate();
  return (
    <div>
      <Result
        icon={<LoadingOutlined />}
        title="Chúng tôi sắp ra mắt!"
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Trở về trang chủ
          </Button>
        }
      />
    </div>
  );
}
