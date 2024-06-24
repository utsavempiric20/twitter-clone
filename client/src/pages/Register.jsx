import "../css/Login.css";
import twitter from "../assets/Vector.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import ProfilePic from "../assets/profile.jpeg";

const Register = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isAlert, setIsAlert] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    userDescription: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
    console.log(registerInfo);
  };

  const registerSubmit = (event) => {
    event.preventDefault();
    if (registerInfo.password !== registerInfo.confirmPassword) {
      setIsAlert(!isAlert);
      return;
    }
    console.log(registerInfo);
    registerInfo("");
  };

  const uploadImage = (e) => {
    if (e[0]) {
      setProfileImage(URL.createObjectURL(e[0]));
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
          <div className="container-md" style={{ width: "50%" }}>
            <div className="loginForm">
              <div className="loginTxt">Sign up</div>
              <div className="loginPara">
                Create a new account by filling in info below.
              </div>
              <div className="mainProfile">
                <div className="avatar">
                  <img
                    src={profileImage ? profileImage : ProfilePic}
                    alt="profile-pic"
                    className="avatar"
                  />
                </div>
                <div style={{ marginLeft: "15px" }}>
                  <div className="profileTxt">Profile Picture</div>
                  <div className="mb-3">
                    <label
                      htmlFor="formFile"
                      className="form-label profile-btn"
                    >
                      Update
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      onChange={(e) => uploadImage(e.target.files)}
                    />
                  </div>
                </div>
              </div>
              <form onSubmit={registerSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    className="form-control inputBox"
                    value={registerInfo.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">User Description</label>
                  <input
                    type="text"
                    name="userDescription"
                    placeholder="User Description"
                    className="form-control inputBox"
                    value={registerInfo.userDescription}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    className="form-control inputBox"
                    value={registerInfo.email}
                    onChange={handleChange}
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
                        value={registerInfo.password}
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

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <div className="row mb-3">
                    <div className="col-md-13 input-group">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "password" : "text"}
                        className="form-control inputBox"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        value={registerInfo.confirmPassword}
                        onChange={handleChange}
                      />

                      <i
                        className={
                          showConfirmPassword
                            ? "input-group-text bi bi-eye-slash"
                            : "input-group-text bi bi-eye"
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      ></i>
                    </div>
                  </div>
                </div>
                {isAlert ? (
                  <Alert
                    message={" Confirm password must be same as Password"}
                  />
                ) : (
                  ""
                )}
                <div className="signNBackBtn">
                  <button type="submit" className="signBtn">
                    Sign up
                  </button>
                  <Link to={"/"} className="backBtn">
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
