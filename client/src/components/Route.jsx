import { Route, Routes, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import SideBar from "../layout/Sidebar";
import SinglePost from "./HomeComponents/SinglePost";
import Home from "../pages/Home";

const MyRoutes = ({
  authContract,
  twitterContract,
  account,
  userDetails,
  setUserDetails,
}) => {
  let location = useLocation();
  return (
    <div style={{ display: "flex", width: "60%", margin: "auto" }}>
      {location.pathname === "/" || location.pathname === "/register" ? (
        <></>
      ) : (
        <SideBar
          authContract={authContract}
          twitterContract={twitterContract}
          account={account}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Login
              authContract={authContract}
              account={account}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
            />
          }
        />
        <Route
          path="/register"
          element={<Register authContract={authContract} account={account} />}
        />
        <Route
          path="/home"
          element={
            <Home
              userDetails={userDetails}
              authContract={authContract}
              twitterContract={twitterContract}
              account={account}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              authContract={authContract}
              twitterContract={twitterContract}
              account={account}
            />
          }
        />
        <Route
          path="/post/:type/:postId"
          element={
            <SinglePost
              authContract={authContract}
              twitterContract={twitterContract}
              account={account}
              userDetails={userDetails}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default MyRoutes;
