import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import Upload from "./components/Pages/Upload";
import Viewer from "./components/Pages/Viewer";
import Share from "./components/Pages/Share";
import Received from "./components/Pages/Recieved";
import LandingPage from "./components/Pages/LandingPage";
import DocumentManagement from "./components/Pages/DocumentManagement";
import AdminLandingPage from "./components/Pages/AdminLandingPage";
import AllUsersPage from "./components/Pages/AllUsersPage"; // ✅ Import this

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/upload", element: <Upload /> },
  { path: "/viewer", element: <Viewer /> },
  { path: "/share", element: <Share /> },
  { path: "/document", element: <DocumentManagement /> },
  { path: "/received", element: <Received /> },
  { path: "/adminlandingpage", element: <AdminLandingPage /> },
  { path: "/all-users", element: <AllUsersPage /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
