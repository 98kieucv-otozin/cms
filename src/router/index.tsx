import { createBrowserRouter, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.tsx";
import DealerLayout from "../layouts/DealerLayout.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";

import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Dashboard from "../pages/admin/Dashboard.tsx";
import Cars from "../pages/admin/Cars.tsx";

import UploadCar from "../pages/dealer/UploadCar.tsx";
import MyCars from "../pages/dealer/MyCars.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/dealer",
    element: (
      <ProtectedRoute>
        <DealerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "upload", element: <UploadCar /> },
      { path: "my-cars", element: <MyCars /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cars", element: <Cars /> },
    ],
  },
]);

export default router;

