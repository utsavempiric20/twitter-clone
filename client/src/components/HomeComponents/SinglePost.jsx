import {
  Avatar,
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "../../css/SinglePost.css";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import { useParams } from "react-router-dom";
import TimeComponent from "./TimeComponent";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState([
    {
      id: 1,
      username: "un567",
      time: 1718953872,
      tweet:
        "fdf sdb ss sdjl re dflsd dhfdfd dfdlfjdfjd dfdkhfjd udsc ei ewh d wl. ds sdhf hh shs sws ssfdjkf djsh reifdfd fdfh gr di sie reoas ah w cb dfdjfh lasa sdsikh ds. sdg sdsbs sdhsd sdhs sdhgd sdbssu sdsjs  sdjsd jsduwe jsiww diwebwd dsdd qqww.",
      likeCounter: 0,
      isLike: false,
    },
    {
      id: 2,
      username: "rt12",
      time: 1718950700,
      tweet:
        "fdf sdb ss sdjl re dflsd dhfdfd dfdlfjdfjd dfdkhfjd udsc ei ewh d wl. ds sdhf hh shs sws ssfdjkf djsh reifdfd fdfh gr di sie reoas ah w cb dfdjfh lasa sdsikh ds. sdg sdsbs sdhsd sdhs sdhgd sdbssu sdsjs  sdjsd jsduwe jsiww diwebwd dsdd qqww.",
      likeCounter: 0,
      isLike: false,
    },
    {
      id: 3,
      username: "utero12",
      time: 1718966284,
      tweet:
        "fdf sdb ss sdjl re dflsd dhfdfd dfdlfjdfjd dfdkhfjd udsc ei ewh d wl. ds sdhf hh shs sws ssfdjkf djsh reifdfd fdfh gr di sie reoas ah w cb dfdjfh lasa sdsikh ds. sdg sdsbs sdhsd sdhs sdhgd sdbssu sdsjs  sdjsd jsduwe jsiww diwebwd dsdd qqww.",
      likeCounter: 0,
      isLike: false,
    },
  ]);
  const [addComment, setAddComment] = useState("");
  const [commentLength, setCommentLength] = useState(240);
  const [comments, setComments] = useState([]);

  const handleAddComment = (e) => {
    const newValue = e.target.value;
    setAddComment(newValue);
    setCommentLength(240 - newValue.length);
  };

  const addTweet = (event) => {
    event.preventDefault();
    console.log(addComment);
    setComments([...comments, { comment: addComment }]);
    console.log(comments);
    setAddComment("");
  };

  const handlerCounter = () => {
    let newArray = { ...post };
    if (newArray.isLike) {
      newArray.isLike = false;
      newArray.likeCounter -= 1;
      setPost(newArray);
    } else {
      newArray.isLike = true;
      newArray.likeCounter += 1;
      setPost(newArray);
    }
  };

  const handleCommentCounter = (index) => {
    console.log(index);
    let newComment = [...comments];
    if (newComment[index]["isLike"]) {
      newComment[index]["isLike"] = false;
      newComment[index]["likeCounter"] -= 1;
      setComments(newComment);
    } else {
      newComment[index]["isLike"] = true;
      newComment[index]["likeCounter"] += 1;
      setComments(newComment);
    }
  };

  useEffect(() => {
    const findPost = post.find((element) => {
      if (element.id == postId) {
        return element;
      }
    });
    setPost(findPost);
  }, []);

  return (
    <>
      <Box className="singlePostMainComponent">
        <Box component="div" className="userPost" key={post.id}>
          <Box className="userDataComponent" component="div">
            <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>U</Avatar>
            <Typography className="userTxt">@{post.username}</Typography>
            <Typography className="userPostTime" component="p">
              <TimeComponent time={post.time} />
            </Typography>
          </Box>
          <Box className="userTweet">
            <Typography className="userAddTweet" gutterBottom={true}>
              {post.tweet}
            </Typography>
          </Box>
          <Box className="userBottomIcons">
            <Box className="userInteractionButtons">
              <IconButton>
                <ModeCommentOutlinedIcon />
              </IconButton>
              <Typography>1</Typography>
            </Box>

            <Box className="userInteractionButtons">
              <IconButton>
                <LoopOutlinedIcon />
              </IconButton>
              <Typography>1</Typography>
            </Box>

            <Box className="userInteractionButtons">
              <IconButton
                onClick={handlerCounter}
                sx={{ color: post.isLike ? "#F4245E" : "gray" }}
              >
                {post.isLike ? (
                  <FavoriteOutlinedIcon />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </IconButton>
              <Typography>{post.likeCounter}</Typography>
            </Box>

            <Box className="userInteractionButtons">
              <IconButton>
                <FileUploadOutlinedIcon />
              </IconButton>
              <Typography>1</Typography>
            </Box>
          </Box>
          <Divider />
        </Box>
        <Box className="commentsSection">
          <Box className="commentComponents">
            <Typography className="commentsTxt">Comments</Typography>
            {comments.map((item, index) => {
              return (
                <Box component="div" className="userComment" key={index}>
                  <Box className="userDataComponent" component="div">
                    <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                      U
                    </Avatar>
                    <Typography className="userTxt">
                      @{item.username}
                    </Typography>
                    <Typography className="userPostTime">
                      <TimeComponent time={item.time} />
                    </Typography>
                  </Box>
                  <Box className="userTweet">
                    <Typography
                      className="userAddTweet"
                      gutterBottom={true}
                      component="p"
                    >
                      {item.comment}
                    </Typography>
                  </Box>
                  <Box className="userBottomIcons">
                    <Box className="userInteractionButtons">
                      <IconButton>
                        <ModeCommentOutlinedIcon />
                      </IconButton>
                      <Typography>1</Typography>
                    </Box>

                    <Box className="userInteractionButtons">
                      <IconButton>
                        <LoopOutlinedIcon />
                      </IconButton>
                      <Typography>1</Typography>
                    </Box>

                    <Box className="userInteractionButtons">
                      <IconButton
                        onClick={() => {
                          handleCommentCounter(index);
                        }}
                        sx={{ color: item.isLike ? "#F4245E" : "gray" }}
                      >
                        {item.isLike ? (
                          <FavoriteOutlinedIcon />
                        ) : (
                          <FavoriteBorderOutlinedIcon />
                        )}
                      </IconButton>
                      <Typography>{item.likeCounter}</Typography>
                    </Box>

                    <Box className="userInteractionButtons">
                      <IconButton>
                        <FileUploadOutlinedIcon />
                      </IconButton>
                      <Typography>1</Typography>
                    </Box>
                  </Box>
                  <Divider />
                </Box>
              );
            })}
          </Box>
          <Box className="addCommentComponent">
            <Box className="addTweetComponent">
              <form onSubmit={addTweet}>
                <Box className="replyingToComponent">
                  <Typography sx={{ color: "#5b7083" }}>replying to</Typography>
                  <Typography className="replyToPersonTxt"> @ub8542</Typography>
                </Box>
                <Box className="writeTweetComponent">
                  <TextField
                    inputProps={{ maxLength: 240 }}
                    variant="standard"
                    //   InputProps={{ disableUnderline: true }}
                    aria-label="empty textarea"
                    autoFocus
                    placeholder="Post your reply"
                    className="tweetTextArea"
                    multiline={true}
                    value={addComment}
                    onChange={(e) => handleAddComment(e)}
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
                    {commentLength} Characters left
                  </Typography>
                  <button className="tweetCBtn" type="submit">
                    Reply
                  </button>
                </Box>
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SinglePost;
