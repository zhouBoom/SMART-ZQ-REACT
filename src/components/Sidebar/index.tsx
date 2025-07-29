// src/components/Sidebar/index.tsx
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../router/routes";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      style={{ height: "100%" }}
    >
      {routes
        .filter(route => !route.hideInMenu)
        .map(route => (
          <Menu.Item key={route.path} icon={route.icon}>
            {route.name}
          </Menu.Item>
        ))}
    </Menu>
  );
};

export default Sidebar;