import { Box } from "@mui/system";
import React, { useState } from "react";
import { useFeedPostStyles as classes } from "../../styles";
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
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import FollowSuggestions from "../shared/FollowSuggestions";
import PlaceIcon from "@mui/icons-material/Place";
import OptionsDialog from "../shared/OptionsDialog";
import { formatDateToNow } from "../../utils/formatDate";
import Image from "react-graceful-image";
import {
  SAVE_POST,
  UNSAVE_POST,
  LIKE_POST,
  UNLIKE_POST,
  CREATE_COMMENT,
} from "./../../graphql/mutations";
import { GET_FEED } from "../../graphql/queries";
import { UserContext } from "./../../App";
import { useMutation } from "@apollo/client";
import SharePost from "../shared/SharePost";

function FeedPost({ post, index }) {
  const [showCaption, setShowCaption] = useState(false);
  const [showOptionsDialog, setOptionsDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const {
    id,
    media,
    likes,
    likes_aggregate,
    saved_posts,
    user,
    location,
    comments,
    comments_aggregate,
    caption,
    created_at,
    establishment,
  } = post;
  const showFollowSuggestions = index === 1;

  const likesCount = likes_aggregate.aggregate.count;
  const commentsCount = comments_aggregate.aggregate.count;

  const postFullUrl = `${window.location.origin}/p/${id}`;

  function handleShareClose() {
    setShowShareDialog(false);
  }
  return (
    <>
      <Box component="article" sx={classes.article}>
        {/* Feed Post Header */}
        <Box sx={classes.postHeader}>
          <UserCard user={user} location={location} />
          <MoreIcon
            sx={classes.moreIcon}
            onClick={() => {
              setOptionsDialog(true);
            }}
          />
        </Box>
        {/* Feed Post Image */}
        <Box
          style={{
            width: "100%",
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
        <Box>
          <Link to={`/p/${post?.id}`}>
            <Image component="img" src={media} alt="Post media" width="100%" />
          </Link>
        </Box>

        {/* Feed Post Buttons */}
        <Box sx={classes.postButtonsWrapper}>
          <Box sx={classes.postButtons}>
            <LikeButton likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon onClick={() => setShowShareDialog(true)} />
            <SaveButton savedPosts={saved_posts} postId={id} />
          </Box>
          <Typography sx={classes.likes} variabt="subtitle2">
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>
          <Box sx={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography
                component="span"
                variant="subtitle2"
                sx={classes.username}
              >
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <Typography
                variant="body2"
                component="animate"
                dangerouslySetInnerHTML={{ __html: caption }}
              ></Typography>
            ) : (
              <Box sx={classes.captionWrapper}>
                <HTMLEllipsis
                  unsafeHTML={caption}
                  sx={classes.caption}
                  maxLine="0"
                  ellipsis="..."
                  basedOn="letters"
                />
                <Button
                  sx={classes.moreButton}
                  onClick={() => setShowCaption(true)}
                >
                  more
                </Button>
              </Box>
            )}
          </Box>
          <Link to={`/p/${id}`}>
            <Typography
              sx={classes.commentsLink}
              variant="body2"
              component="div"
            >
              View all {commentsCount} comments
            </Typography>
          </Link>
          {comments.map((comment) => (
            <Box key={comment.id}>
              <Link to={`/${comment.user.username}`}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={classes.commentUsername}
                >
                  {comment.user.username}
                </Typography>{" "}
                <Typography variant="body2" component="span">
                  {comment.content}
                </Typography>
              </Link>
            </Box>
          ))}
          <Typography color="textSecondary" sx={classes.datePosted}>
            {formatDateToNow(created_at)}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Divider />
          <Comment postId={id} />
        </Box>
      </Box>

      {/* {showFollowSuggestions && <FollowSuggestions />} */}
      {showOptionsDialog && (
        <OptionsDialog
          authorId={user.id}
          postId={id}
          onClose={() => setOptionsDialog(false)}
        />
      )}
      {showShareDialog && (
        <SharePost shareUrl={postFullUrl} onClose={handleShareClose} />
      )}
    </>
  );
}

function LikeButton({ likes, postId, authorId }) {
  const { currentUserId, feedIds } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some(({ user_id }) => user_id === currentUserId);
  const [liked, setLiked] = useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const onClick = liked ? handleUnlike : handleLike;

  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = { postId, userId: currentUserId, profileId: authorId };

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });
    const typename = result.data.insert_likes?.__typename;
    const count = typename === "likes_mutation_response" ? 1 : -1;

    const posts = data.posts.map((post) => ({
      ...post,
      likes_aggregate: {
        ...post.likes_aggregate,
        aggregate: {
          ...post.likes_aggregate.aggregate,
          count: post.likes_aggregate.aggregate.count + count,
        },
      },
    }));
    cache.writeQuery({ query: GET_FEED, data: { posts } });
  }

  function handleLike() {
    setLiked(true);
    likePost({ variables, update: handleUpdate });
  }
  function handleUnlike() {
    setLiked(false);
    unlikePost({ variables, update: handleUpdate });
  }

  return <Icon sx={className} onClick={onClick} />;
}

function SaveButton({ postId, savedPosts }) {
  const { currentUserId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some(
    ({ user_id }) => user_id === currentUserId
  );

  const [saved, setSaved] = useState(isAlreadySaved);
  const Icon = saved ? RemoveIcon : SaveIcon;
  const onClick = saved ? handleRemove : handleSave;

  const [savePost] = useMutation(SAVE_POST);
  const [removePost] = useMutation(UNSAVE_POST);
  const variables = {
    postId,
    userId: currentUserId,
  };

  function handleSave() {
    setSaved(true);
    savePost({ variables });
  }
  function handleRemove() {
    setSaved(false);
    removePost({ variables });
  }

  return <Icon sx={classes.saveIcon} onClick={onClick} />;
}

function Comment({ postId }) {
  const { currentUserId, feedIds } = React.useContext(UserContext);
  const [content, setContent] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT);

  function handleUpdate(cache, result) {
    const variables = {
      limit: 2,
      feedIds,
    };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });

    const oldComment = result.data.insert_comments_one;
    const newComment = {
      ...oldComment,
      user: { ...oldComment.user },
    };
    const posts = data.posts.map((post) => {
      const newPost = {
        ...post,
        comments: [...post.comments, newComment],
        comments_aggregate: {
          ...post.comments_aggregate,
          aggregate: {
            ...post.comments_aggregate.aggregate,
            count: post.comments_aggregate.aggregate.count + 1,
          },
        },
      };
      return post.id === postId ? newPost : post;
    });

    cache.writeQuery({ query: GET_FEED, data: { posts } });
    setContent("");
  }

  function handleAddComment() {
    const variables = {
      content,
      postId,
      userId: currentUserId,
    };
    createComment({ variables, update: handleUpdate });
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

export default FeedPost;
