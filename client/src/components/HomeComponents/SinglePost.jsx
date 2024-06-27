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
import { Link, useParams } from "react-router-dom";
import TimeComponent from "./TimeComponent";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import "../../css/Tweet.css";
import { ethers } from "ethers";

const SinglePost = ({
  authContract,
  twitterContract,
  account,
  userDetails,
}) => {
  const { type, postId } = useParams();
  const [post, setPost] = useState([]);
  const [addComment, setAddComment] = useState("");
  const [commentLength, setCommentLength] = useState(240);
  const [comments, setComments] = useState([]);
  const [state, setState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const numToByte = ethers.utils.hexZeroPad(
    ethers.utils.hexlify(Number(postId)),
    4
  );

  const handleAddComment = (e) => {
    const newValue = e.target.value;
    setAddComment(newValue);
    setCommentLength(240 - newValue.length);
  };

  const addUsersComment = async (event) => {
    event.preventDefault();
    try {
      console.log(addComment);
      // setComments([...comments, { comment: addComment }]);
      const commentResponse =
        type == 1
          ? await twitterContract.addComment(numToByte, addComment)
          : await twitterContract.addReply(numToByte, addComment);
      await commentResponse.wait();
      setAddComment("");
      setState(!state);
    } catch (error) {
      console.log(error);
    }
  };

  const handlerCounter = async () => {
    try {
      let newArray = { ...post };
      const postId = newArray.postId;
      if (newArray.isLike) {
        newArray.isLike = false;
        newArray.likes -= 1;
        type == 1
          ? await twitterContract.disLikePost(postId)
          : await twitterContract.dislikeOnComments(postId);
        setPost(newArray);
      } else {
        newArray.isLike = true;
        newArray.likes += 1;
        type == 1
          ? await twitterContract.likePost(postId)
          : await twitterContract.addLikeOnComments(postId);
        setPost(newArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentCounter = async (index) => {
    try {
      let newComment = [...comments];
      const commentId = newComment[index].commentId;
      if (newComment[index]["isLikeComment"]) {
        newComment[index]["isLikeComment"] = false;
        newComment[index]["commentTotalLike"] -= 1;
        const disLikeCommentResponse = await twitterContract.dislikeOnComments(
          commentId
        );
        await disLikeCommentResponse.wait();
        setComments(newComment);
      } else {
        newComment[index]["isLikeComment"] = true;
        newComment[index]["commentTotalLike"] += 1;
        const likeCommentResponse = await twitterContract.addLikeOnComments(
          commentId
        );
        await likeCommentResponse.wait();
        setComments(newComment);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      const singlePostData = await twitterContract.getPostDetails(numToByte);
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

      setPost({
        userAvatarTxt: postUserName.charAt(0),
        postId: Number(postId),
        postUserAddress: postUserAddress,
        content: singlePostData.content,
        postTime: postTime,
        likes: likes,
        postUserName: postUserName,
        isLike: isLikeByUser,
        postCommentLength: commentsLength.length,
      });
    };

    const fetchSingleComment = async () => {
      const singlePostData = await twitterContract.getCommentInfo(numToByte);
      const userData = await authContract.getUserInfo(singlePostData.user);
      const isLikeByUser = await twitterContract.getCommentLikedByUser(
        singlePostData.commentId
      );
      const commentsLength = await twitterContract.getReplyOnCommment(
        singlePostData.commentId
      );
      const postUserAddress = userData[0];
      const postUserName = userData[1];
      const postTime = Number(singlePostData.commentTime["_hex"]);
      const likes = Number(singlePostData.commentTotalLike["_hex"]);

      setPost({
        userAvatarTxt: postUserName.charAt(0),
        postId: Number(postId),
        postUserAddress: postUserAddress,
        content: singlePostData.comment,
        postTime: postTime,
        likes: likes,
        postUserName: postUserName,
        isLike: isLikeByUser,
        postCommentLength: commentsLength.length,
      });
    };

    const fetchComment = async () => {
      const commentsData = await twitterContract.getComments(numToByte);
      const newData = await Promise.all(
        commentsData.map(async (commentId) => {
          const singleComment = await twitterContract.getCommentInfo(commentId);
          const userData = await authContract.getUserInfo(singleComment.user);
          const isLikeComment = await twitterContract.getCommentLikedByUser(
            commentId
          );
          const commentsLength = await twitterContract.getReplyOnCommment(
            singleComment.commentId
          );
          return {
            commentAvatarTxt: userData[1].charAt(0),
            user: singleComment.user,
            postId: Number(singleComment.postId),
            commentId: Number(singleComment.commentId),
            comment: singleComment.comment,
            commentTotalLike: Number(singleComment.commentTotalLike["_hex"]),
            postUserName: userData[1],
            isLikeComment: isLikeComment,
            commentTime: singleComment.commentTime,
            postCommentLength: commentsLength.length,
          };
        })
      );
      setComments(newData);
    };

    const fetchCommentReply = async () => {
      const commentsData = await twitterContract.getReplyOnCommment(numToByte);
      const newData = await Promise.all(
        commentsData.map(async (commentId) => {
          const singleComment = await twitterContract.getCommentInfo(commentId);
          const userData = await authContract.getUserInfo(singleComment.user);
          const isLikeComment = await twitterContract.getCommentLikedByUser(
            commentId
          );
          const commentsLength = await twitterContract.getReplyOnCommment(
            singleComment.commentId
          );

          return {
            commentAvatarTxt: userData[1].charAt(0),
            user: singleComment.user,
            postId: Number(singleComment.postId),
            commentId: Number(singleComment.commentId),
            comment: singleComment.comment,
            commentTotalLike: Number(singleComment.commentTotalLike["_hex"]),
            postUserName: userData[1],
            isLikeComment: isLikeComment,
            commentTime: singleComment.commentTime,
            postCommentLength: commentsLength.length,
          };
        })
      );
      setComments(newData);
    };
    setIsLoading(true);
    type == 1
      ? twitterContract && fetchPost()
      : twitterContract && fetchSingleComment();
    type == 1
      ? twitterContract && fetchComment()
      : twitterContract && fetchCommentReply();
    setIsLoading(false);
  }, [state, twitterContract, postId]);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <Box className="singlePostMainComponent">
          <Box component="div" className="userPost" key={post.id}>
            <Box className="userDataComponent" component="div">
              <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                {post.userAvatarTxt}
              </Avatar>
              <Typography className="userTxt">@{post.postUserName}</Typography>
              <Typography className="userPostTime" component="p">
                <TimeComponent time={post.postTime} />
              </Typography>
            </Box>
            <Box className="userTweet">
              <Typography className="userAddTweet" gutterBottom={true}>
                {post.content}
              </Typography>
            </Box>
            <Box className="userBottomIcons">
              <Box className="userInteractionButtons">
                <IconButton>
                  <ModeCommentOutlinedIcon />
                </IconButton>
                <Typography>{post.postCommentLength}</Typography>
              </Box>

              <Box className="userInteractionButtons">
                <IconButton>
                  <LoopOutlinedIcon />
                </IconButton>
                <Typography>0</Typography>
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
                <Typography>{post.likes}</Typography>
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
          <Box className="commentsSection">
            <Box className="commentComponents">
              <Typography className="commentsTxt">Comments</Typography>
              {comments.map((item, index) => {
                return (
                  <Box component="div" className="userComment" key={index}>
                    <Link
                      to={`/post/2/${item.commentId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Box className="userDataComponent" component="div">
                        <Avatar
                          sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}
                        >
                          {item.commentAvatarTxt}
                        </Avatar>
                        <Typography className="userTxt">
                          @{item.postUserName}
                        </Typography>
                        <Typography className="userPostTime">
                          <TimeComponent time={item.commentTime} />
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
                            handleCommentCounter(index);
                          }}
                          sx={{
                            color: item.isLikeComment ? "#F4245E" : "gray",
                          }}
                        >
                          {item.isLikeComment ? (
                            <FavoriteOutlinedIcon />
                          ) : (
                            <FavoriteBorderOutlinedIcon />
                          )}
                        </IconButton>
                        <Typography>{item.commentTotalLike}</Typography>
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
            <Box className="addCommentComponent">
              <Box className="addTweetComponent">
                <form onSubmit={addUsersComment}>
                  <Box className="replyingToComponent">
                    <Typography sx={{ color: "#5b7083" }}>
                      replying to
                    </Typography>
                    <Typography className="replyToPersonTxt">
                      {" "}
                      @{userDetails.username}
                    </Typography>
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
                      {commentLength}/240
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
      )}
    </>
  );
};

export default SinglePost;
