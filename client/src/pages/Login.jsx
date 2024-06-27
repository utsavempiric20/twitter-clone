import "../css/Login.css";
import twitter from "../assets/Vector.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";

const Login = ({ authContract, account, userDetails, setUserDetails }) => {
  console.log("login", account);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [isAlert, setIsAlert] = useState(false);
  const handleAlert = () => {
    setIsAlert(true);
    setTimeout(() => {
      setIsAlert(false);
    }, 4000);
  };

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const logInSubmit = async (event) => {
    event.preventDefault();
    try {
      if (loginInfo.username === "" && loginInfo.password === "") {
        return;
      }
      const response = await authContract.logIn(account);
      await response.wait();
      const getUserInfo = await authContract.getUserInfo(account);
      console.log(getUserInfo);
      const username = getUserInfo[1];
      const timeToHex = getUserInfo[2];
      const registerTime = Number(timeToHex["_hex"]);
      const userObj = { username, registerTime };
      // setUserDetails({ username: username, registerTime: registerTime });
      localStorage.setItem("userInfo", JSON.stringify(userObj));
      navigate("/home", { replace: true });
      setLoginInfo({ username: "", password: "" });
    } catch (error) {
      handleAlert();
      console.log(error);
    }
  };

  return (
    <div className="divideScreen" style={{ width: "100%" }}>
      <div className="leftSide">
        <div className="twitterLogo">
          <img src={twitter} alt="twitter" />
          <div className="twitterText">twitter</div>
        </div>
      </div>
      <div className="rightSide">
        <div className="twitterLogo">
          <div className="container-md">
            <div className="loginForm">
              <div className="loginTxt">Login</div>
              <div className="loginPara">
                Welcome Back! Please login to your account.
              </div>

              <form onSubmit={logInSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    placeholder="Enter a Username"
                    name="username"
                    className="form-control inputBox"
                    value={loginInfo.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="row mb-3">
                    <div className="col-md-13 input-group">
                      <input
                        id="password"
                        type={showPassword ? "password" : "text"}
                        className="form-control inputBox"
                        name="password"
                        placeholder="Password"
                        required
                        value={loginInfo.password}
                        onChange={handleChange}
                      />

                      <i
                        className={
                          showPassword
                            ? "input-group-text bi bi-eye-slash"
                            : "input-group-text bi bi-eye"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                      ></i>
                    </div>
                  </div>
                </div>

                <div
                  className="form-group form-check"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="exampleCheck1"
                    />
                    <label
                      className="rememberTxt form-check-label"
                      htmlFor="exampleCheck1"
                    >
                      Remember me
                    </label>
                  </div>

                  <a href="http://" className="forgotPassText">
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="loginBtn"
                  disabled={!loginInfo.username && !loginInfo.password}
                >
                  Login with Metamask
                </button>
              </form>

              <div className="loginAccount">
                <div className="dontAccountTxt">
                  Doesn’t have an account yet?
                </div>

                <Link to={"/register"} className="signUpTxt">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAlert && <AlertComponent message={"User doesn't exist"} />}
    </div>
  );
};

export default Login;
