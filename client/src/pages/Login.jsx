import "../css/Login.css";
import twitter from "../assets/Vector.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    console.log(loginInfo);
  };

  const logInSubmit = (event) => {
    event.preventDefault();
    if (loginInfo.username === "" && loginInfo.password === "") {
      return;
    }
    setLoginInfo("");
  };

  // const connectWallet = async () => {
  //   const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  //   const contractAbi = abi.abi;
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const account = await ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       // const contract = await ethers.Contract(
  //       //   contractAddress,
  //       //   contractAbi,
  //       //   signer
  //       // );
  //       console.log(signer);
  //       // setWalletData({ provider, signer, contract });
  //     } else {
  //       alert("install metamask");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          <div className="container-md" style={{ width: "50%" }}>
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
    </div>
  );
};

export default Login;
