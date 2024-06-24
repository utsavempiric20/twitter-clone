import { Route, Routes, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import SideBar from "../layout/Sidebar";
import MainC from "../pages/Home";
import SinglePost from "./HomeComponents/SinglePost";

const MyRoutes = () => {
  let location = useLocation();
  return (
    <div style={{ display: "flex", width: "60%", margin: "auto" }}>
      {location.pathname === "/" || location.pathname === "/register" ? (
        <></>
      ) : (
        <SideBar />
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<MainC />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:postId" element={<SinglePost />} />
      </Routes>
    </div>
  );
};

export default MyRoutes;
