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
import { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [tweetModal, setTweetModal] = useState("");
  const [tweetModalLength, setTweetModalLength] = useState(240);

  const handleTweet = (e) => {
    const newValue = e.target.value;
    setTweetModal(newValue);
    setTweetModalLength(240 - newValue.length);
  };

  const addTweet = (event) => {
    event.preventDefault();
    console.log(tweetModal);
    setTweetModal("");
    setTweetModalLength(240);
    handleClose();
  };

  return (
    <>
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
              <IconButton edge="end">
                <MoreHorizOutlinedIcon />
              </IconButton>
            }
          >
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[500] }}>U</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="@ub8542"
                  secondary="July 20"
                  primaryTypographyProps={{ color: "#0F1419", fontWeight: 700 }}
                  secondaryTypographyProps={{
                    color: "#5B7083",
                    fontWeight: 500,
                  }}
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
                <Avatar sx={{ bgcolor: blue[500], marginRight: "10px" }}>
                  U
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
                  {tweetModalLength} Characters left
                </Typography>
                <button className="tweetCBtn" type="submit">
                  Tweet
                </button>
              </Box>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default SideBar;
