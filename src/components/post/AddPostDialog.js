import { ArrowBackIos, PinDrop } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  Divider,
  InputAdornment,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { useAddPostDialogStyles } from "../../styles";
import { UserContext } from "./../../App";
import serialize from "../../utils/serialize";
import { CREATE_POST } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const AddPostDialog = ({ media, handleClose }) => {
  const { me, currentUserId } = React.useContext(UserContext);
  const [editor] = React.useState(() => withReact(createEditor()));
  const [value, setValue] = React.useState(initialValue);
  const [location, setLocation] = React.useState("");
  const classes = useAddPostDialogStyles();
  const [submitting, setSubmitting] = React.useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const navigate = useNavigate();

  const establishmentRef = React.useRef();

  async function handleSharePost() {
    console.log(establishmentRef);
    setSubmitting(true);
    const variables = {
      userId: currentUserId,
      location,
      caption: serialize({ children: value }),
      media: media.url,
      establishmentName: establishmentRef.current.name,
      establishmentLongitude: establishmentRef.current.geometry.location.lng(),
      establishmentLatitude: establishmentRef.current.geometry.location.lat(),
      establishmentUrl: establishmentRef.current.url,
      establishmentAddress: establishmentRef.current.formatted_address,
      establishmentCoordinates: `(${establishmentRef.current.geometry.location.lat()}, ${establishmentRef.current.geometry.location.lng()})`,
    };
    console.log("variables", variables);
    const { data } = await createPost({ variables });
    const postId = data.insert_posts_one.id;
    setSubmitting(false);
    navigate(`/p/${postId}`);
    window.location.reload();
  }

  async function discardPost() {
    console.log("Post Discarded");
    const delete_token = media.delete_token;
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/delete_by_token`,
        {
          token: delete_token,
        }
      );
      console.log("Image deleted from Cloudinary", response);
    } catch (error) {
      console.error(error);
    }

    handleClose();
  }

  return (
    <Dialog fullScreen open onClose={handleClose}>
      <AppBar sx={classes.appBar}>
        <Toolbar sx={classes.toolbar}>
          <ArrowBackIos onClick={discardPost} />
          <Typography align="center" variant="body1" sx={classes.title}>
            New Post
          </Typography>
          <Button
            color="primary"
            sx={classes.share}
            disabled={submitting}
            onClick={handleSharePost}
          >
            Share
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Paper sx={classes.paper}>
        <Avatar src={me.profile_image} />
        <Slate
          editor={editor}
          value={initialValue}
          onChange={(value) => setValue(value)}
        >
          <Editable
            style={{ ...classes.editor }}
            placeholder="write your caption..."
          />
        </Slate>
        <Avatar src={media.url} sx={classes.avatarLarge} variant="square" />
      </Paper>
      {/*       <TextField
        fullWidth
        placeholder="Location"
        sx={{ ...classes.root, ...classes.underline }}
        InputProps={{
          sx: {
            ".MuiInputBase-input": { ...classes.input },
          },

          startAdornment: (
            <InputAdornment position="start">
              <PinDrop />
            </InputAdornment>
          ),
        }}
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      /> */}

      <Autocomplete
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => {
          console.log(place);
          establishmentRef.current = place;
        }}
        style={{
          width: "100%",
          height: "40px",
          fontSize: "20px",
          marginTop: "20px",
        }}
        placeholder="Enter Establishment Name and Location"
        options={{
          componentRestrictions: { country: "us" },
          fields: ["geometry", "name", "url", "formatted_address"],
          strictBounds: false,
          types: ["establishment"],
        }}
      />
    </Dialog>
  );
};

export default AddPostDialog;
