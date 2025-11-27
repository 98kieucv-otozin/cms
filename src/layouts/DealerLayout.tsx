import { Layout, Menu, MenuProps, Space, Avatar, Dropdown } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { MenuInfo } from "rc-menu/lib/interface";
import {
  UploadIcon,
  CarIcon,
  ArrowRightFromBracketIcon,
  UserProfileIcon,
} from "../components/icons/Icons";
import { PRIMARY_COLOR } from "../constants/colors";

const { Header, Content } = Layout;

export default function DealerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuth();

  const handleMenuClick: MenuProps['onClick'] = (item) => {
    navigate(item.key);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Avatar dropdown menu
  const avatarMenuItems = [
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <ArrowRightFromBracketIcon width={16} height={16} />,
      danger: true,
    },
  ];

  const handleAvatarMenuClick = (info: MenuInfo) => {
    if (info.key === "logout") {
      handleLogout();
    }
  };

  // Get current selected menu key
  const selectedKey = location.pathname;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Main Header: Logo, Avatar */}
      <Header
        style={{
          background: PRIMARY_COLOR,
          padding: 0,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dealer")}
          >
            Car Market
          </div>

          {/* Avatar */}
          <Dropdown
            menu={{
              items: avatarMenuItems,
              onClick: handleAvatarMenuClick,
            }}
            placement="bottomRight"
          >
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                icon={<UserProfileIcon width={20} height={20} />}
                style={{ backgroundColor: PRIMARY_COLOR }}
              />
              <span style={{ color: "#fff" }}>{username}</span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      {/* Navigation Menu Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <Menu
            mode="horizontal"
            onClick={handleMenuClick}
            selectedKeys={[selectedKey]}
            style={{
              borderBottom: "none",
              lineHeight: "48px",
            }}
            items={[
              {
                key: "/dealer/upload",
                label: "Đăng bán xe",
                icon: <UploadIcon />,
              },
              {
                key: "/dealer/my-cars",
                label: "Xe đã đăng",
                icon: <CarIcon />,
              },
            ]}
          />
        </div>
      </div>

      {/* Content */}
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

