import { Box } from "@mui/material";
import Tweet from "../components/HomeComponents/Tweet";
import AllPosts from "../components/HomeComponents/AllPosts";

const Home = () => {
  return (
    <>
      <Box component="main" sx={{ width: "70%", p: 0 }}>
        <Tweet />
        <AllPosts />
      </Box>
    </>
  );
};

export default Home;
