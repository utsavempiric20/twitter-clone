import { Avatar, Box, Divider, Tab, Typography } from "@mui/material";
import "../css/Profile.css";
import { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserPosts from "../components/ProfileComponents/UserPosts";
import UserLikes from "../components/ProfileComponents/UserLikes";

const Profile = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };
  const date = new Date(1718950566 * 1000);
  const month = date.getMonth();
  const year = date.getFullYear();
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
            @ub8542
          </Typography>
          <Typography className="tweetCount">10 Tweets</Typography>
        </Box>
        <Divider />
        <Box className="profileInfo">
          <Avatar className="profileAvatar" sx={{ bgcolor: "#1da1f2" }}>
            U
          </Avatar>
          <Typography className="profileUsernameTxt">@ub8542</Typography>
          <Typography className="tweetCount">
            Joined {months[month]} {year}
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
              <UserPosts />
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">
              <UserLikes />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
