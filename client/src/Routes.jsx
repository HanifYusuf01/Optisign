import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import Upload from "./components/Pages/Upload";
import Viewer from "./components/Pages/Viewer";
import Share from "./components/Pages/Share";
import Received from "../src/components/Pages/Recieved"
import LandingPage from "./components/Pages/LandingPage";
import DocumentManagement from "./components/Pages/DocumentManagement";
import AdminLandingPage from "../src/components/Pages/AdminLandingPage";
import AllUsersPage from "./components/Pages/AllUsersPage";
import AllDocuments from "../src/components/Pages/AllDocuments"; 
import Viewer2 from "./components/Pages/Viewer2";
import Viewer3 from "./components/Pages/Viewer3";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/upload", element: <Upload /> },
  { path: "/viewer", element: <Viewer /> },
  { path: "/viewer2", element: <Viewer2 /> },
  { path: "/viewer3", element: <Viewer3 /> },
  { path: "/share", element: <Share /> },
  { path: "/document", element: <DocumentManagement /> },
  { path: "/received", element: <Received /> },
  { path: "/adminlandingpage", element: <AdminLandingPage /> },
  { path: "/all-users", element: <AllUsersPage /> },
  { path: "/all-documents", element: <AllDocuments /> }, 
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
