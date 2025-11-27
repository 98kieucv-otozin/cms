import { Layout, Menu, MenuProps, Button, Space } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  DashboardIcon,
  CarIcon,
  ArrowRightFromBracketIcon,
} from "../components/icons/Icons";

const { Header, Sider, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();

  const handleMenuClick: MenuProps['onClick'] = (item) => {
    navigate(item.key);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          items={[
            { key: "/admin", icon: <DashboardIcon />, label: "Dashboard" },
            { key: "/admin/cars", icon: <CarIcon />, label: "Quản lý xe" },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          color: "#fff", 
          fontSize: 18, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <span>Hệ thống quản trị</span>
          <Space>
            <span style={{ color: "#fff" }}>Xin chào, {username}</span>
            <Button 
              type="primary" 
              danger 
              icon={<ArrowRightFromBracketIcon />} 
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

