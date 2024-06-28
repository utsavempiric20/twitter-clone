import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import "../../css/AllPosts.css";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useEffect, useState } from "react";
import TimeComponent from "../HomeComponents/TimeComponent";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const UserPosts = (props) => {
  const { authContract, twitterContract, account, userDetails } = props;
  const [userPosts, setUserPosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [data, setData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const TweetIconList = [
    { iconName: <ImageOutlinedIcon />, color: "#1da1f2" },
    { iconName: <GifBoxOutlinedIcon />, color: "#1da1f2" },
    { iconName: <BarChartOutlinedIcon />, color: "#1da1f2" },
    { iconName: <SentimentSatisfiedSharpIcon />, color: "#1da1f2" },
    { iconName: <CalendarTodayOutlinedIcon />, color: "#1da1f2" },
  ];

  const handleOpenModal = (index, content) => {
    setTweetModal(content);
    setTweetModalLength(240 - content.length);
    setSelectedIndex(index);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);
  const [tweetModal, setTweetModal] = useState("");
  const [tweetModalLength, setTweetModalLength] = useState(240);
  const [userAvatarTxt, setUserAvatarTxt] = useState("");

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIndex(null);
  };

  const open = Boolean(anchorEl);

  const handlerCounter = async (index) => {
    try {
      let newPostArray = [...userPosts];
      const postId = newPostArray[index].postId;
      if (newPostArray[index]["isLike"]) {
        newPostArray[index]["isLike"] = false;
        newPostArray[index]["likes"] -= 1;
        const dislikePostResponse = await twitterContract.disLikePost(postId);
        await dislikePostResponse.wait();
        setUserPosts(newPostArray);
      } else {
        newPostArray[index]["isLike"] = true;
        newPostArray[index]["likes"] += 1;
        const likePostResponse = await twitterContract.likePost(postId);
        await likePostResponse.wait();
        setUserPosts(newPostArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (index) => {
    try {
      const newPostArray = [...userPosts];
      const postId = newPostArray[index].postId;
      const numToBytePostId = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(Number(postId)),
        4
      );
      const deletePost = await twitterContract.deletePost(numToBytePostId);
      await deletePost.wait();
      setUserPosts(newPostArray);
      setData(!data);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleTweet = (e) => {
    const newValue = e.target.value;
    setTweetModal(newValue);
    setTweetModalLength(240 - newValue.length);
  };

  const updateTweet = async (event, index) => {
    event.preventDefault();
    try {
      const newPostArray = [...userPosts];
      const postId = newPostArray[index].postId;
      const numToBytePostId = ethers.utils.hexZeroPad(
        ethers.utils.hexlify(Number(postId)),
        4
      );
      const addPost = await twitterContract.updatePost(
        numToBytePostId,
        tweetModal
      );
      await addPost.wait();
      setUserPosts(newPostArray);
      setData(!data);
      setTweetModal("");
      setTweetModalLength(240);
      handleCloseModal();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const allPosts = async () => {
    const userPostData = await twitterContract.getUserPosts(account);
    const newData = await Promise.all(
      userPostData.map(async (id) => {
        const singlePostData = await twitterContract.getPostDetails(id);
        const userData = await authContract.getUserInfo(
          singlePostData.userAddress
        );
        const isLikeByUser = await twitterContract.getPostLikedByUser(
          singlePostData.postId
        );
        const postUserAddress = userData[0];
        const postUserName = userData[1];
        const postTime = Number(singlePostData.postTime["_hex"]);
        const likes = Number(singlePostData.likes["_hex"]);
        const postId = Number(singlePostData.postId);
        const commentsLength = await twitterContract.getComments(
          singlePostData.postId
        );
        return {
          userAvatarTxt: postUserName.charAt(0),
          postId: postId,
          postUserAddress: postUserAddress,
          content: singlePostData.content,
          postTime: postTime,
          likes: likes,
          postUserName: postUserName,
          isLike: isLikeByUser,
          postCommentLength: commentsLength.length,
        };
      })
    );
    newData.sort((a, b) => b.postTime - a.postTime);
    setUserPosts(newData);
    setUserAvatarTxt(userDetails.username.charAt(0));
  };

  useEffect(() => {
    twitterContract && allPosts();
  }, [data, twitterContract]);

  return (
    <>
      <Box className="allPostsMainElement" component="div">
        {userPosts.map((item, index) => {
          return (
            <Box component="div" className="userPost" key={item.postId}>
              <Box className="userDataComponent" component="div">
                <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                  {item.userAvatarTxt}
                </Avatar>
                <Typography className="userTxt">
                  @{item.postUserName}
                </Typography>
                <Typography className="userPostTime">
                  <TimeComponent time={item.postTime} />
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    handleClick(e, index);
                  }}
                  id={index}
                >
                  <MoreVertIcon />
                </IconButton>
                <Popover
                  id={`popover-${index}`}
                  open={open && selectedIndex === index}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  sx={{ boxShadow: "0px 1px 2px #d7d7d7" }}
                >
                  <MenuList>
                    <MenuItem
                      onClick={() =>
                        handleOpenModal(selectedIndex, item.content)
                      }
                    >
                      <ListItemIcon>
                        <ModeEditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleDeletePost(index)}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </MenuList>
                </Popover>
              </Box>
              <Link
                to={`/post/1/${item.postId}`}
                style={{ textDecoration: "none" }}
              >
                <Box className="userTweet">
                  <Typography
                    className="userAddTweet"
                    gutterBottom={true}
                    component="p"
                  >
                    {item.content}
                  </Typography>
                </Box>
              </Link>
              <Box className="userBottomIcons">
                <Box className="userInteractionButtons">
                  <IconButton>
                    <ModeCommentOutlinedIcon />
                  </IconButton>
                  <Typography>{item.postCommentLength}</Typography>
                </Box>

                <Box className="userInteractionButtons">
                  <IconButton>
                    <LoopOutlinedIcon />
                  </IconButton>
                  <Typography>0</Typography>
                </Box>

                <Box className="userInteractionButtons">
                  <IconButton
                    onClick={() => {
                      handlerCounter(index);
                    }}
                    sx={{ color: item.isLike ? "#F4245E" : "gray" }}
                  >
                    {item.isLike ? (
                      <FavoriteOutlinedIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </IconButton>
                  <Typography>{item.likes}</Typography>
                </Box>

                <Box className="userInteractionButtons">
                  <IconButton>
                    <FileUploadOutlinedIcon />
                  </IconButton>
                  <Typography>0</Typography>
                </Box>
              </Box>
              <Divider />

              <Dialog
                id={selectedIndex}
                open={openModal}
                onClose={handleCloseModal}
                sx={{ width: "100%" }}
              >
                <DialogTitle>Update Post</DialogTitle>
                <DialogContent>
                  <form
                    id={selectedIndex}
                    onSubmit={(event) => updateTweet(event, selectedIndex)}
                  >
                    <Box className="writeTweetComponent">
                      <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                        {userAvatarTxt}
                      </Avatar>
                      <TextField
                        id={`textF=${selectedIndex}`}
                        itemID={`textF=${selectedIndex}`}
                        inputProps={{ maxLength: 240 }}
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        aria-label="empty textarea"
                        autoFocus
                        placeholder="what's Happening"
                        className="tweetTextArea"
                        multiline={true}
                        value={tweetModal}
                        onChange={(e) => handleTweet(e)}
                      />
                    </Box>
                    <Box className="bottomTweetComponent">
                      {TweetIconList.map((item, index) => {
                        return (
                          <IconButton
                            key={index}
                            sx={{ color: `${item.color}` }}
                          >
                            {item.iconName}
                          </IconButton>
                        );
                      })}
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography sx={{ marginRight: "20px" }}>
                        {tweetModalLength}/240
                      </Typography>
                      <button className="tweetCBtn" type="submit">
                        Update
                      </button>
                    </Box>
                  </form>
                </DialogContent>
              </Dialog>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default UserPosts;
