// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Authentication {
    struct User {
        string userName;
        address userAddress;
        uint256 registerTime;
    }

    mapping(address => bool) userExist;
    mapping(address => bool) userLoggedIn;
    mapping(string => bool) userNameExist;
    mapping(address => User) userInfo;

    modifier mustLoggedIn() {
        require(userLoggedIn[msg.sender], "User is not Logged in");
        _;
    }

    modifier isNotLoggedIn() {
        require(!userLoggedIn[msg.sender], "User is already logged In");
        _;
    }

    modifier isUserRegistered() {
        require(userExist[msg.sender], "User doesn't exist");
        _;
    }

    modifier isNotRegistered() {
        require(!userExist[msg.sender], "User exist");
        _;
    }

    modifier isUserNameExist(string memory _userName) {
        require(!userNameExist[_userName], "Username is Exist");
        _;
    }

    function register(
        string memory _userName,
        address caller
    ) external isNotRegistered isUserNameExist(_userName) {
        userInfo[caller] = User({
            userName: _userName,
            userAddress: caller,
            registerTime: block.timestamp
        });
        userExist[caller] = true;
        userNameExist[_userName] = true;
    }

    function logIn(address caller) public isUserRegistered isNotLoggedIn {
        userLoggedIn[caller] = true;
    }

    function logOut(address caller) public mustLoggedIn {
        userLoggedIn[caller] = false;
    }

    function getUserInfo(
        address caller
    ) external view returns (address, string memory, uint256) {
        User memory user = userInfo[caller];
        return (user.userAddress, user.userName, user.registerTime);
    }

    function getMustLoggedIn(address caller) external view returns (bool) {
        return userLoggedIn[caller];
    }

    function getIsNotLoggedIn(address caller) external view returns (bool) {
        return !userLoggedIn[caller];
    }

    function getIsUserRegistered(address caller) external view returns (bool) {
        return userExist[caller];
    }

    function getIsNotRegistered(address caller) external view returns (bool) {
        return !userExist[caller];
    }

    function getIsUserNameExist(
        string memory _userName
    ) external view returns (bool) {
        return !userNameExist[_userName];
    }
}
