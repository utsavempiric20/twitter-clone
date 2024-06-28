import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import "../../css/AllPosts.css";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import { useEffect, useState } from "react";
import TimeComponent from "../HomeComponents/TimeComponent";
import { Link } from "react-router-dom";

const UserLikes = (props) => {
  const { authContract, twitterContract } = props;
  const [userLikePosts, setUserLikePosts] = useState([]);
  const [userLikeComments, setUserLikeComments] = useState([]);
  const [getData, setGetData] = useState(false);

  const handlerCounter = async (index) => {
    try {
      let newPostArray = [...userLikePosts];
      const postId = newPostArray[index].postId;
      if (newPostArray[index]["isLike"]) {
        newPostArray[index]["isLike"] = false;
        newPostArray[index]["likes"] -= 1;
        const dislikePostResponse = await twitterContract.disLikePost(postId);
        await dislikePostResponse.wait();
        setUserLikePosts(newPostArray);
        setGetData(!getData);
      } else {
        newPostArray[index]["isLike"] = true;
        newPostArray[index]["likes"] += 1;
        const likePostResponse = await twitterContract.likePost(postId);
        await likePostResponse.wait();
        setUserLikePosts(newPostArray);
        setGetData(!getData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentCounter = async (index) => {
    try {
      let newComment = [...userLikeComments];
      const commentId = newComment[index].commentId;
      if (newComment[index]["isLikeComment"]) {
        newComment[index]["isLikeComment"] = false;
        newComment[index]["commentTotalLike"] -= 1;
        const disLikeCommentResponse = await twitterContract.dislikeOnComments(
          commentId
        );
        await disLikeCommentResponse.wait();
        setUserLikeComments(newComment);
        setGetData(!getData);
      } else {
        newComment[index]["isLikeComment"] = true;
        newComment[index]["commentTotalLike"] += 1;
        const likeCommentResponse = await twitterContract.addLikeOnComments(
          commentId
        );
        await likeCommentResponse.wait();
        setUserLikeComments(newComment);
        setGetData(!getData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const allPosts = async () => {
    const userLikePostData = await twitterContract.getUserLikePosts(1);
    const newData = await Promise.all(
      userLikePostData.map(async (id) => {
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
    setUserLikePosts(newData);
  };

  const allComments = async () => {
    const commentsData = await twitterContract.getUserLikePosts(0);
    const newData = await Promise.all(
      commentsData.map(async (commentId) => {
        const singleComment = await twitterContract.getCommentInfo(commentId);
        const userData = await authContract.getUserInfo(singleComment.user);
        const isLikeComment = await twitterContract.getCommentLikedByUser(
          commentId
        );
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
    newData.sort((a, b) => b.commentTime - a.commentTime);
    setUserLikeComments(newData);
  };

  useEffect(() => {
    twitterContract && allPosts();
    twitterContract && allComments();
  }, [getData, twitterContract]);

  return (
    <>
      <Box className="allPostsMainElement" component="div">
        <Box>
          {userLikePosts.map((item, index) => {
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
          {userLikeComments.map((item, index) => {
            return (
              <Box component="div" className="userComment" key={index}>
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
      </Box>
    </>
  );
};

export default UserLikes;
