import { Avatar, Box, Divider, Tab, Typography } from "@mui/material";
import "../css/Profile.css";
import { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserPosts from "../components/ProfileComponents/UserPosts";
import UserLikes from "../components/ProfileComponents/UserLikes";
import UserTweetNReply from "../components/ProfileComponents/UserTweetNReply";

const Profile = (props) => {
  const { userDetails, authContract, twitterContract, account } = props;
  const [countTweet, setCountTweet] = useState(0);
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };
  return (
    <>
      <Box className="profileComponent" component="div">
        <Box className="profileComponentHeader" component="div">
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "19px",
            }}
          >
            @{userDetails.username}
          </Typography>
          <Typography className="tweetCount">{countTweet} Tweets</Typography>
        </Box>
        <Divider />
        <Box className="profileInfo">
          <Avatar className="profileAvatar" sx={{ bgcolor: "#1da1f2" }}>
            {userDetails.username}
          </Avatar>
          <Typography className="profileUsernameTxt">
            @{userDetails.username}
          </Typography>
          <Typography className="tweetCount">
            Joined {new Date(userDetails.registerTime * 1000).toDateString()}
          </Typography>
        </Box>
        <Box className="tabComponent">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                indicatorColor="primary"
                onChange={handleChange}
                variant="fullWidth"
                aria-label="lab API tabs example"
              >
                <Tab label="Tweets" className="tabLabelTxt" value="1" />
                <Tab
                  label="Tweets & replies"
                  className="tabLabelTxt"
                  value="2"
                />
                <Tab label="Likes" className="tabLabelTxt" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <UserPosts
                authContract={authContract}
                twitterContract={twitterContract}
                account={account}
                userDetails={userDetails}
              />
            </TabPanel>
            <TabPanel value="2">
              <UserTweetNReply
                authContract={authContract}
                twitterContract={twitterContract}
                account={account}
                countTweet={countTweet}
                setCountTweet={setCountTweet}
              />
            </TabPanel>
            <TabPanel value="3">
              <UserLikes
                authContract={authContract}
                twitterContract={twitterContract}
                account={account}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
