// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

interface IAuthentication {
    function register(string memory _userName, address caller) external;

    function logIn(address caller) external;

    function logOut(address caller) external;

    function getMustLoggedIn(address caller) external view returns (bool);

    function getIsNotLoggedIn(address caller) external view returns (bool);

    function getIsUserRegistered(address caller) external view returns (bool);

    function getIsNotRegistered(address caller) external view returns (bool);

    function getIsUserNameExist(
        string memory _userName
    ) external view returns (bool);
}

contract Twitter {
    IAuthentication iAuthentication;

    struct Post {
        address userAddress;
        bytes4 postId;
        string content;
        uint256 likes;
        uint256 postTime;
        uint256 lastUpdated;
    }

    struct Comment {
        address user;
        bytes4 postId;
        bytes4 commentId;
        string comment;
        uint256 commentTotalLike;
        uint256 commentTime;
    }

    bytes4[] allPosts;
    mapping(address => bytes4[]) userPosts;
    mapping(bytes4 => Post) getPostInfo;
    mapping(address => bytes4[]) userLikes;
    mapping(address => mapping(bytes4 => bool)) isPostLikedByUser;

    mapping(bytes4 => Comment) commentInfo;
    mapping(bytes4 => bytes4[]) userComments;
    mapping(address => bytes4[]) userCommentLikes;
    mapping(address => mapping(bytes4 => bool)) commentsLikes;

    mapping(bytes4 => uint256) allPostIndex;
    mapping(bytes4 => uint256) userPostIndex;
    mapping(address => mapping(bytes4 => uint256)) userLikesIndex;
    mapping(address => mapping(bytes4 => uint256)) userCommentLikesIndex;

    constructor(address _iAuthentication) {
        iAuthentication = IAuthentication(_iAuthentication);
    }

    modifier mustLoggedIn() {
        require(
            iAuthentication.getMustLoggedIn(msg.sender),
            "User is not Logged in"
        );
        _;
    }

    modifier isPostExist(bytes4 _postId) {
        Post memory post = getPostInfo[_postId];
        require(post.userAddress != address(0), "Post doesn't exist.");
        _;
    }

    modifier isPostOwner(bytes4 _postId) {
        Post memory post = getPostInfo[_postId];
        require(post.userAddress == msg.sender, "Not Post owner");
        _;
    }

    // modifier isUserCommentExist(bytes4 _commentId) {
    //     require(
    //         commentInfo[_commentId].commentId == _commentId,
    //         "comment not found"
    //     );
    //     _;
    // }

    function createPost(string memory _content) public mustLoggedIn {
        bytes4 _postId = bytes4(
            keccak256(abi.encodePacked(msg.sender, _content, block.timestamp))
        );
        Post memory post = Post({
            userAddress: msg.sender,
            postId: _postId,
            content: _content,
            likes: 0,
            postTime: block.timestamp,
            lastUpdated: block.timestamp
        });
        uint256 allPostNextIndex = allPosts.length;
        uint256 userPostNextIndex = userPosts[msg.sender].length;
        allPosts.push(_postId);
        userPosts[msg.sender].push(_postId);
        allPostIndex[_postId] = allPostNextIndex;
        userPostIndex[_postId] = userPostNextIndex;
        getPostInfo[_postId] = post;
    }

    function updatePost(
        bytes4 _postId,
        string memory _content
    ) public mustLoggedIn isPostExist(_postId) isPostOwner(_postId) {
        Post storage post = getPostInfo[_postId];
        post.content = _content;
        post.lastUpdated = block.timestamp;
    }

    function deletePost(
        bytes4 _postId
    ) public mustLoggedIn isPostExist(_postId) isPostOwner(_postId) {
        // bytes4[] storage storeUserComments = userComments[_postId];
        // if (storeUserComments.length > 0) {
        // TODO:we update it in future.  This is a Temporary Approach.
        //     uint256 indexComment = storeUserComments.length;
        //     for (uint256 i = 0; i < indexComment; i++) {
        //         bytes4 lastId = storeUserComments[storeUserComments.length-1];
        //         if (commentsLikes[msg.sender][lastId]) {
        //             dislikeOnComments(lastId);
        //         }
        //         storeUserComments.pop();
        //     }
        // }

        if (isPostLikedByUser[msg.sender][_postId]) {
            disLikePost(_postId);
        }

        uint256 postIndex = allPostIndex[_postId];
        if (postIndex != allPosts.length - 1) {
            bytes4 lastAllPostId = allPosts[allPosts.length - 1];
            allPosts[postIndex] = lastAllPostId;
            allPostIndex[lastAllPostId] = postIndex;
        }
        allPosts.pop();
        bytes4[] storage storeUserPosts = userPosts[msg.sender];
        uint256 index = userPostIndex[_postId];
        if (index != storeUserPosts.length - 1) {
            bytes4 lastUserPostId = storeUserPosts[storeUserPosts.length - 1];
            storeUserPosts[index] = lastUserPostId;
            userPostIndex[lastUserPostId] = index;
        }

        storeUserPosts.pop();
        delete allPostIndex[_postId];
        delete userPostIndex[_postId];
        delete getPostInfo[_postId];
    }

    function likePost(bytes4 _postId) public mustLoggedIn isPostExist(_postId) {
        require(
            !isPostLikedByUser[msg.sender][_postId],
            "You already liked it"
        );
        isPostLikedByUser[msg.sender][_postId] = true;
        Post storage post = getPostInfo[_postId];
        post.likes += 1;
        uint256 nextIndex = userLikes[msg.sender].length;
        userLikes[msg.sender].push(_postId);
        userLikesIndex[msg.sender][_postId] = nextIndex;
    }

    function disLikePost(
        bytes4 _postId
    ) public mustLoggedIn isPostExist(_postId) {
        require(
            isPostLikedByUser[msg.sender][_postId] == true,
            "You already dislike it"
        );
        isPostLikedByUser[msg.sender][_postId] = false;
        Post storage post = getPostInfo[_postId];
        post.likes -= 1;
        bytes4[] storage userAllLikes = userLikes[msg.sender];
        uint256 index = userLikesIndex[msg.sender][_postId];
        if (index != userAllLikes.length - 1) {
            bytes4 lastPostId = userAllLikes[userAllLikes.length - 1];
            userAllLikes[index] = lastPostId;
            userLikesIndex[msg.sender][lastPostId] = index;
        }
        userAllLikes.pop();
        delete userLikesIndex[msg.sender][_postId];
    }

    function addComment(
        bytes4 _postId,
        string memory _comment
    ) public mustLoggedIn isPostExist(_postId) {
        bytes4 _commentId = bytes4(
            keccak256(
                abi.encodePacked(msg.sender, _postId, _comment, block.timestamp)
            )
        );
        Comment memory comment = Comment({
            user: msg.sender,
            postId: _postId, // useful to backtrack to post if only comment is found - implement on frontend - otherwise the postId is not needed in the comment struct
            commentId: _commentId,
            comment: _comment,
            commentTotalLike: 0,
            commentTime: block.timestamp
        });
        userComments[_postId].push(_commentId);
        commentInfo[_commentId] = comment;
    }

    function addReply(
        bytes4 _commentId,
        string memory _reply
    ) public mustLoggedIn // isUserCommentExist(_commentId)
    {
        bytes4 _postId = commentInfo[_commentId].postId;
        bytes4 replyId = bytes4(
            keccak256(
                abi.encodePacked(msg.sender, _postId, _reply, block.timestamp)
            )
        );
        Comment memory comment = Comment({
            user: msg.sender,
            postId: _commentId,
            commentId: replyId,
            comment: _reply,
            commentTotalLike: 0,
            commentTime: block.timestamp
        });
        commentInfo[replyId] = comment;
        userComments[_commentId].push(replyId);
    }

    function addLikeOnComments(
        bytes4 _commentId
    ) public mustLoggedIn // isUserCommentExist(_commentId)
    {
        require(!commentsLikes[msg.sender][_commentId], "You already liked it");
        commentsLikes[msg.sender][_commentId] = true;
        Comment storage comment = commentInfo[_commentId];
        comment.commentTotalLike += 1;
        uint256 nextIndex = userCommentLikes[msg.sender].length;
        userCommentLikes[msg.sender].push(_commentId);
        userCommentLikesIndex[msg.sender][_commentId] = nextIndex;
    }

    function dislikeOnComments(
        bytes4 _commentId
    ) public mustLoggedIn // isUserCommentExist(_commentId)
    {
        require(
            commentsLikes[msg.sender][_commentId] == true,
            "You already dislike it"
        );
        commentsLikes[msg.sender][_commentId] = false;
        Comment storage comment = commentInfo[_commentId];
        comment.commentTotalLike -= 1;
        bytes4[] storage storeLikes = userCommentLikes[msg.sender];
        uint256 index = userCommentLikesIndex[msg.sender][_commentId];
        if (index != storeLikes.length - 1) {
            bytes4 lastCommentId = storeLikes[storeLikes.length - 1];
            storeLikes[index] = lastCommentId;
            userCommentLikesIndex[msg.sender][lastCommentId] = index;
        }

        storeLikes.pop();
        delete userCommentLikesIndex[msg.sender][_commentId];
    }

    function getPostDetails(
        bytes4 _postId
    )
        external
        view
        mustLoggedIn
        isPostExist(_postId)
        returns (
            address userAddress,
            bytes4 postId,
            string memory content,
            uint256 likes,
            uint256 postTime,
            uint256 lastUpdated
        )
    {
        Post memory post = getPostInfo[_postId];
        return (
            post.userAddress,
            post.postId,
            post.content,
            post.likes,
            post.postTime,
            post.lastUpdated
        );
    }

    function getAllPosts()
        external
        view
        mustLoggedIn
        returns (bytes4[] memory)
    {
        return allPosts;
    }

    function getUserPosts(
        address user
    ) external view mustLoggedIn returns (bytes4[] memory) {
        return userPosts[user];
    }

    function getCommentInfo(
        bytes4 _commentId
    )
        external
        view
        mustLoggedIn
        returns (
            address user,
            bytes4 postId,
            bytes4 commentId,
            string memory comment,
            uint256 commentTotalLike,
            uint256 commentTime
        )
    {
        Comment memory comments = commentInfo[_commentId];
        return (
            comments.user,
            comments.postId,
            comments.commentId,
            comments.comment,
            comments.commentTotalLike,
            comments.commentTime
        );
    }

    function getComments(
        bytes4 _postId
    )
        external
        view
        mustLoggedIn
        isPostExist(_postId)
        returns (bytes4[] memory)
    {
        return userComments[_postId];
    }

    function getReplyOnCommment(
        bytes4 _commentId
    ) external view mustLoggedIn returns (bytes4[] memory) {
        return userComments[_commentId];
    }

    function getUserLikePosts(
        bool likeNComment
    ) external view mustLoggedIn returns (bytes4[] memory) {
        return
            likeNComment ? userLikes[msg.sender] : userCommentLikes[msg.sender];
    }

    function getPostLikedByUser(
        bytes4 _postId
    ) external view mustLoggedIn returns (bool islike) {
        return isPostLikedByUser[msg.sender][_postId];
    }

    function getCommentLikedByUser(
        bytes4 _commentId
    ) external view mustLoggedIn returns (bool isLikeComment) {
        return commentsLikes[msg.sender][_commentId];
    }
}
