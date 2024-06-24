import {
  Avatar,
  Box,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import "../../css/Tweet.css";
import { blue } from "@mui/material/colors";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import GifBoxOutlinedIcon from "@mui/icons-material/GifBoxOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import SentimentSatisfiedSharpIcon from "@mui/icons-material/SentimentSatisfiedSharp";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useState } from "react";

const Tweet = () => {
  const [tweet, setTweet] = useState("");
  const [tweetLength, setTweetLength] = useState(240);

  const handleTweet = (e) => {
    const newValue = e.target.value;
    setTweet(newValue);
    setTweetLength(240 - newValue.length);
  };

  const addTweet = (event) => {
    event.preventDefault();
    console.log(tweet);
    setTweet("");
  };

  return (
    <>
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
                value={tweet}
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
                {tweetLength} Characters left
              </Typography>
              <button className="tweetCBtn" type="submit">
                Tweet
              </button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Tweet;
