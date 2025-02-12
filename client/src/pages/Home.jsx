import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TimeComponent from "../components/HomeComponents/TimeComponent";

const Home = (props) => {
  const { userDetails, authContract, twitterContract, getData, setGetData } =
    props;
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [tweetLength, setTweetLength] = useState(240);
  const [userAvatarTweetTxt, setUserAvatarTweetTxt] = useState("");
  const [post, setPost] = useState([]);
  const TweetIconList = [
    { iconName: <ImageOutlinedIcon />, color: "#1da1f2" },
    { iconName: <GifBoxOutlinedIcon />, color: "#1da1f2" },
    { iconName: <BarChartOutlinedIcon />, color: "#1da1f2" },
    { iconName: <SentimentSatisfiedSharpIcon />, color: "#1da1f2" },
    { iconName: <CalendarTodayOutlinedIcon />, color: "#1da1f2" },
  ];

  const handlerCounter = async (index) => {
    try {
      let newPostArray = [...post];
      const postId = newPostArray[index].postId;
      if (newPostArray[index]["isLike"]) {
        newPostArray[index]["isLike"] = false;
        newPostArray[index]["likes"] -= 1;
        const dislikePostResponse = await twitterContract.disLikePost(postId);
        await dislikePostResponse.wait();
        setPost(newPostArray);
      } else {
        newPostArray[index]["isLike"] = true;
        newPostArray[index]["likes"] += 1;
        const likePostResponse = await twitterContract.likePost(postId);
        await likePostResponse.wait();
        setPost(newPostArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTweet = (e) => {
    const newValue = e.target.value;
    setTweet(newValue);
    setTweetLength(240 - newValue.length);
  };

  const addTweet = async (event) => {
    event.preventDefault();
    try {
      const addPost = await twitterContract.createPost(tweet);
      await addPost.wait();
      setTweet("");
      setTweetLength(240);
      setGetData(!getData);
    } catch (error) {
      console.log(error);
    }
  };

  const allPosts = async () => {
    const allPostData = await twitterContract.getAllPosts();
    const newData = await Promise.all(
      allPostData.map(async (id) => {
        const singlePostData = await twitterContract.getPostDetails(id);
        const userData = await authContract.getUserInfo(
          singlePostData.userAddress
        );
        const isLikeByUser = await twitterContract.getPostLikedByUser(
          singlePostData.postId
        );
        const commentsLength = await twitterContract.getComments(
          singlePostData.postId
        );
        const postUserAddress = userData[0];
        const postUserName = userData[1];
        const postTime = Number(singlePostData.postTime["_hex"]);
        const likes = Number(singlePostData.likes["_hex"]);
        const postId = Number(singlePostData.postId);
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
    setPost(newData);
    setUserAvatarTweetTxt(userDetails.username.charAt(0));
  };

  useEffect(() => {
    setLoading(true);
    twitterContract && allPosts();
    setLoading(false);
  }, [getData, twitterContract]);

  return (
    <>
      {loading ? (
        <CircularProgress color="success" />
      ) : (
        <Box component="main" sx={{ width: "70%", p: 0 }}>
          <Box component="div" className="tweetComponent">
            <Box className="tweetComponentHeader" component="div">
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "18px",
                }}
              >
                Home
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ color: "#1da1f2" }}>
                <AutoAwesomeOutlinedIcon />
              </IconButton>
            </Box>

            <Divider color="#F7F9FA" />

            <Box className="addTweetComponent">
              <form onSubmit={addTweet}>
                <Box className="writeTweetComponent">
                  <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                    {userAvatarTweetTxt}
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
                    value={tweet}
                    onChange={(e) => handleTweet(e)}
                  />
                </Box>
                <Box className="bottomTweetComponent">
                  {TweetIconList.map((item, index) => {
                    return (
                      <IconButton key={index} sx={{ color: `${item.color}` }}>
                        {item.iconName}
                      </IconButton>
                    );
                  })}
                  <Box sx={{ flexGrow: 1 }} />
                  <Typography sx={{ marginRight: "20px" }}>
                    {tweetLength}/240
                  </Typography>
                  <button className="tweetCBtn" type="submit">
                    Tweet
                  </button>
                </Box>
              </form>
            </Box>
          </Box>
          <Box
            className="allPostsMainElement"
            component="div"
            sx={{ marginTop: "10px" }}
          >
            {post.map((item, index) => {
              return (
                <Box component="div" className="userPost" key={index}>
                  <Link
                    to={`/post/1/${item.postId}`}
                    style={{ textDecoration: "none" }}
                  >
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
                    </Box>
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
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Home;
