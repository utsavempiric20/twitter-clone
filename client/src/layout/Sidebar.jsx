import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import "../css/Sidebar.css";
import { blue } from "@mui/material/colors";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";

const SideBar = (props) => {
  let navigate = useNavigate();
  let { authContract, twitterContract, account, userDetails, setUserDetails } =
    props;
  const IconList = [
    { text: "Home", icon: <HomeSharpIcon />, to: "/home" },
    { text: "Explore", icon: <TagOutlinedIcon />, to: "/explore" },
    {
      text: "Notifications",
      icon: <NotificationsNoneOutlinedIcon />,
      to: "/notifications",
    },
    { text: "Messages", icon: <MailOutlineOutlinedIcon />, to: "/messages" },
    {
      text: "Bookmarks",
      icon: <BookmarkBorderOutlinedIcon />,
      to: "/bookmarks",
    },
    { text: "Lists", icon: <ListAltOutlinedIcon />, to: "/lists" },
    { text: "Profile", icon: <PermIdentityOutlinedIcon />, to: "/profile" },
    { text: "More", icon: <MoreHorizOutlinedIcon />, to: "/more" },
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [tweetModal, setTweetModal] = useState("");
  const [tweetModalLength, setTweetModalLength] = useState(240);
  const [userLogOutAlert, setUserLogOutAlert] = useState(false);
  const [userAvatarTxt, setUserAvatarTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const handleUserLogOutAlert = () => {
    setUserLogOutAlert(true);
    setTimeout(() => {
      setUserLogOutAlert(false);
    }, 4000);
  };

  const handleTweet = (e) => {
    const newValue = e.target.value;
    setTweetModal(newValue);
    setTweetModalLength(240 - newValue.length);
  };

  const addTweet = async (event) => {
    event.preventDefault();
    try {
      const addPost = await twitterContract.createPost(tweetModal);
      await addPost.wait();
      setTweetModal("");
      setTweetModalLength(240);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      const response = await authContract.logOut(account);
      await response.wait();
      console.log(response);
      navigate("/", { replace: true });
      setUserDetails({
        username: null,
        registerTime: null,
      });
      localStorage.clear();
    } catch (error) {
      handleUserLogOutAlert();
      console.log(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    setUserDetails({
      username: userData.username,
      registerTime: userData.registerTime,
    });
    setUserAvatarTxt(userData.username.charAt(0));
    setLoading(false);
  }, [twitterContract, authContract]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Box
          className="sideMain"
          sx={{
            overflow: "auto",
            width: "30%",
            height: "100vh",
            borderRight: "2px solid #F7F9FA",
          }}
        >
          <List>
            {IconList.map((item, index) => (
              <ListItem key={index}>
                <Link to={item["to"]} style={{ textDecoration: "none" }}>
                  <ListItemButton>
                    <ListItemIcon>{item["icon"]}</ListItemIcon>
                    <ListItemText
                      className="listItemTxt"
                      primary={item["text"]}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
          <Divider />
          <button className="tweetBtn" onClick={handleOpen}>
            Tweet
          </button>
          <List>
            <ListItem
              style={{ bottom: 0 }}
              secondaryAction={
                <IconButton edge="end" onClick={handleLogOut}>
                  <MoreHorizOutlinedIcon />
                </IconButton>
              }
            >
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: blue[500] }}>{userAvatarTxt}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "#0F1419", fontWeight: 700 }}>
                        @{userDetails.username}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: "#5B7083", fontWeight: 500 }}>
                        {
                          months[
                            new Date(userDetails.registerTime * 1000).getMonth()
                          ]
                        }{" "}
                        {new Date(
                          userDetails.registerTime * 1000
                        ).getFullYear()}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>

          <Dialog open={open} onClose={handleClose} sx={{ width: "100%" }}>
            <DialogTitle>Add Post</DialogTitle>
            <DialogContent>
              <form onSubmit={(event) => addTweet(event)}>
                <Box className="writeTweetComponent">
                  <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                    {userAvatarTxt}
                  </Avatar>
                  <TextField
                    inputProps={{ maxLength: 240 }}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    aria-label="empty textarea"
                    autoFocus
                    placeholder="What's Happening"
                    className="tweetTextArea"
                    multiline={true}
                    value={tweetModal}
                    onChange={(e) => handleTweet(e)}
                  />
                </Box>
                <Box className="bottomTweetComponent">
                  <IconButton sx={{ color: "#1da1f2" }}>
                    <ImageOutlinedIcon />
                  </IconButton>
                  <IconButton sx={{ color: "#1da1f2" }}>
                    <GifBoxOutlinedIcon />
                  </IconButton>
                  <IconButton sx={{ color: "#1da1f2" }}>
                    <BarChartOutlinedIcon />
                  </IconButton>
                  <IconButton sx={{ color: "#1da1f2" }}>
                    <SentimentSatisfiedSharpIcon />
                  </IconButton>
                  <IconButton sx={{ color: "#1da1f2" }}>
                    <CalendarTodayOutlinedIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography sx={{ marginRight: "20px" }}>
                    {tweetModalLength}/240
                  </Typography>
                  <button className="tweetCBtn" type="submit">
                    Tweet
                  </button>
                </Box>
              </form>
            </DialogContent>
          </Dialog>
        </Box>
      )}

      {userLogOutAlert && <AlertComponent message={"User Is not logged In"} />}
    </>
  );
};

export default SideBar;
