import { Box } from "@mui/system";
import React, { useState } from "react";
import { usePostStyles as classes } from "../../styles";
import UserCard from "./../shared/UserCard";
import {
  CommentIcon,
  LikeIcon,
  MoreIcon,
  ShareIcon,
  UnlikeIcon,
  RemoveIcon,
  SaveIcon,
} from "../../icons";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Divider,
  TextField,
  Avatar,
  InputAdornment,
} from "@mui/material";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";

import OptionsDialog from "../shared/OptionsDialog";
import PostSkeleton from "./PostSkeleton";
import { useSubscription, useMutation } from "@apollo/client";
import { GET_POST } from "../../graphql/subscriptions";
import {
  CREATE_COMMENT,
  LIKE_POST,
  SAVE_POST,
  UNLIKE_POST,
  UNSAVE_POST,
} from "./../../graphql/mutations";
import { UserContext } from "./../../App";
import { formatDateToNowShort, formatPostDate } from "../../utils/formatDate";
import Image from "react-graceful-image";

function Post({ postId }) {
  const [showOptionsDialog, setOptionsDialog] = useState(false);
  const variables = { postId };
  const { data, loading } = useSubscription(GET_POST, { variables });

  if (loading) return <PostSkeleton />;
  const {
    id,
    media,
    likes,
    likes_aggregate,
    saved_posts,
    user_id,
    user,
    caption,
    comments,
    created_at,
    location,
    establishment,
  } = data.posts_by_pk;

  const likesCount = likes_aggregate.aggregate.count;

  return (
    <Box sx={classes.postContainer}>
      <Box component="article" sx={classes.article}>
        {/* Post Header */}
        <Box sx={classes.postHeader}>
          <UserCard user={user} avatarSize={32} location={location} />
          <MoreIcon
            sx={classes.moreIcon}
            onClick={() => {
              setOptionsDialog(true);
            }}
          />
        </Box>
        {/* Post Image */}
        <Box sx={classes.postImage}>
          <Image src={media} alt="Post media" width="100%" />
        </Box>
        <Box
          style={{
            padding: "5px 0 5px 10px",
            borderTop: "1px solid #ccc",
            display: "flex",
          }}
        >
          <PlaceIcon style={{ paddingRight: "5px" }} />
          <Link to={`/e/${establishment?.id}`}>
            <Typography variant="body2" sx={classes.typography}>
              {establishment?.name}
            </Typography>
          </Link>
        </Box>
        {/* Post Buttons */}
        <Box sx={classes.postButtonsWrapper}>
          <Box sx={classes.postButtons}>
            <LikeButton postId={postId} likes={likes} authorId={user_id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton postId={postId} savedPosts={saved_posts} />
          </Box>
          <Typography sx={classes.likes} variabt="subtitle2">
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>
          <Box
            style={{
              overflowY: "scroll",
              padding: "16px 12px",
              height: "100%",
            }}
          >
            <AuthorCaption
              user={user}
              createdAt={created_at}
              caption={caption}
            />
            {comments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </Box>

          <Typography color="textSecondary" sx={classes.datePosted}>
            {formatPostDate(created_at)}
          </Typography>
          <Box sx={{ ...classes.comment }}>
            <Divider /> <Comment postId={postId} />
          </Box>
        </Box>
      </Box>

      {showOptionsDialog && (
        <OptionsDialog
          postId={id}
          authorId={user.id}
          onClose={() => setOptionsDialog(false)}
        />
      )}
    </Box>
  );
}

function AuthorCaption({ user, caption, createdAt }) {
  return (
    <Box style={{ display: "flex" }}>
      <Avatar
        src={user.profile_image}
        alt="User Avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <Box style={{ display: "flex", flexDirection: "column" }}>
        <Link to={user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            sx={classes.username}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            sx={classes.postCaption}
            style={{ paddingLeft: 0 }}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(createdAt)}
        </Typography>
      </Box>
    </Box>
  );
}

function UserComment({ comment }) {
  return (
    <Box style={{ display: "flex" }}>
      <Avatar
        src={comment.user.profile_image}
        alt="User Avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <Box style={{ display: "flex", flexDirection: "column" }}>
        <Link to={comment.user.username}>
          <Typography
            variant="subtitle2"
            component="span"
            sx={classes.username}
          >
            {comment.user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            sx={classes.postCaption}
            style={{ paddingLeft: 0 }}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography
          style={{ marginTop: 16, marginBottom: 4, display: "inline-block" }}
          color="textSecondary"
          variant="caption"
        >
          {formatDateToNowShort(comment.created_at)}
        </Typography>
      </Box>
    </Box>
  );
}

function LikeButton({ likes, postId, authorId }) {
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some((like) => like.user_id === currentUserId);
  const [liked, setLiked] = useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = { postId, userId: currentUserId, profileId: authorId };

  function handleLike() {
    likePost({ variables });
    setLiked(true);
  }
  function handleUnlike() {
    unlikePost({ variables });
    setLiked(false);
  }

  return <Icon sx={className} onClick={onClick} />;
}

function SaveButton({ savedPosts, postId }) {
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    (post) => post.user_id === currentUserId
  );
  const [saved, setSaved] = useState(isAlreadySaved);
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);
  const variables = { userId: currentUserId, postId: postId };

  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ? handleRemove : handleSave;

  function handleSave() {
    savePost({ variables });
    setSaved(true);
  }
  function handleRemove() {
    unsavePost({ variables });
    setSaved(false);
  }

  return <Icon sx={classes.saveIcon} onClick={onClick} />;
}

function Comment({ postId }) {
  const { currentUserId } = React.useContext(UserContext);
  const [content, setContent] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT);

  function handleAddComment() {
    const variables = {
      content: content,
      postId: postId,
      userId: currentUserId,
    };
    createComment({ variables });
    setContent("");
  }

  return (
    <Box sx={classes.commentContainer}>
      <TextField
        variant="standard"
        fullWidth
        value={content}
        placeholder="Add a comment.."
        multiline
        maxRows={2}
        onChange={(e) => setContent(e.target.value)}
        sx={classes.textField}
        InputProps={{
          sx: { ...classes.root, ...classes.underline },
          startAdornment: (
            <InputAdornment position="start">
              <SentimentSatisfiedAltOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        color="primary"
        sx={classes.commentButton}
        disabled={!content.trim()}
        onClick={handleAddComment}
      >
        Post
      </Button>
    </Box>
  );
}

export default Post;
