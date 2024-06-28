import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TimeComponent from "../../components/HomeComponents/TimeComponent";

const UserTweetNReply = (props) => {
  const { authContract, twitterContract, account, countTweet, setCountTweet } =
    props;
  const [tweets, setTweets] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlerCounter = async (index) => {
    try {
      let newPostArray = [...tweets];
      const postId = newPostArray[index].postId;
      if (newPostArray[index]["isLike"]) {
        newPostArray[index]["isLike"] = false;
        newPostArray[index]["likes"] -= 1;
        await twitterContract.disLikePost(postId);
        setTweets(newPostArray);
      } else {
        newPostArray[index]["isLike"] = true;
        newPostArray[index]["likes"] += 1;
        await twitterContract.likePost(postId);
        setTweets(newPostArray);
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

  const fetchTweets = async () => {
    const tweetIds = await twitterContract.getUserPosts(account);
    const tweetData = await Promise.all(
      tweetIds.map(async (id) => {
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
    tweetData.sort((a, b) => b.postTime - a.postTime);
    setTweets(tweetData);
  };

  const fetchComments = async () => {
    const commentIds = await twitterContract.getUserReplies();
    const commentData = await Promise.all(
      commentIds.map(async (id) => {
        const singleComment = await twitterContract.getCommentInfo(id);
        const userData = await authContract.getUserInfo(singleComment.user);
        const isLikeComment = await twitterContract.getCommentLikedByUser(id);
        const commentsLength = await twitterContract.getReplyOnComment(
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
    commentData.sort((a, b) => b.commentTime - a.commentTime);
    setComments(commentData);
    setCountTweet(tweets.length + commentData.length);
  };

  useEffect(() => {
    setLoading(true);
    twitterContract && fetchTweets();
    twitterContract && fetchComments();
    setLoading(false);
  }, [twitterContract, countTweet]);
  return (
    <>
      {loading ? (
        <>
          <CircularProgress color="success" />
        </>
      ) : (
        <Box>
          <Box>
            {tweets.map((item, index) => {
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
          <Box>
            {comments.map((item, index) => {
              return (
                <Box component="div" className="userPost" key={index}>
                  <Link
                    to={`/post/2/${item.commentId}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Box className="userDataComponent" component="div">
                      <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
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
                        sx={{ color: item.isLikeComment ? "#F4245E" : "gray" }}
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
        </Box>
      )}
    </>
  );
};

export default UserTweetNReply;
