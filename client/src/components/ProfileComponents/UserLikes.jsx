import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import "../../css/AllPosts.css";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import { useState } from "react";
import TimeComponent from "../HomeComponents/TimeComponent";
import { Link } from "react-router-dom";

const UserLikes = () => {
  const [like, setLike] = useState([
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
      time: 1716256653,
      tweet:
        "fdf sdb ss sdjl re dflsd dhfdfd dfdlfjdfjd dfdkhfjd udsc ei ewh d wl. ds sdhf hh shs sws ssfdjkf djsh reifdfd fdfh gr di sie reoas ah w cb dfdjfh lasa sdsikh ds. sdg sdsbs sdhsd sdhs sdhgd sdbssu sdsjs  sdjsd jsduwe jsiww diwebwd dsdd qqww.",
      likeCounter: 0,
      isLike: false,
    },
  ]);

  const handlerCounter = (index) => {
    let newPostArray = [...like];
    if (newPostArray[index]["isLike"]) {
      newPostArray[index]["isLike"] = false;
      newPostArray[index]["likeCounter"] -= 1;
      setLike(newPostArray);
    } else {
      newPostArray[index]["isLike"] = true;
      newPostArray[index]["likeCounter"] += 1;
      setLike(newPostArray);
    }
  };

  return (
    <>
      <Box className="allPostsMainElement" component="div">
        {like.map((item, index) => {
          return (
            <Box component="div" className="userPost" key={index}>
              <Link to={`/post/${item.id}`} style={{ textDecoration: "none" }}>
                <Box className="userDataComponent" component="div">
                  <Avatar sx={{ bgcolor: "#1da1f2", marginRight: "10px" }}>
                    U
                  </Avatar>
                  <Typography className="userTxt">@{item.username}</Typography>
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
                    {item.tweet}
                  </Typography>
                </Box>
              </Link>
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
    </>
  );
};

export default UserLikes;
