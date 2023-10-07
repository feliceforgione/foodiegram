import { ArrowBackIos, Close } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Button,
  Dialog,
  Divider,
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

const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
const key = process.env.REACT_APP_MS_COMPUTER_VISION_SUBSCRIPTION_KEY;
const endpoint = process.env.REACT_APP_MS_COMPUTER_VISION_ENDPOINT;
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

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
  const [imageTags, setImageTags] = React.useState(null);
  const [imageIsFoodItem, setImageIsFoodItem] = React.useState(true);
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

  function formatTags(tags) {
    return tags.map((tag) => `${tag.name}`).join(", ");
  }

  React.useEffect(() => {
    async function detectFoodInImage() {
      async function getImageTags(imageURL) {
        const tags = (
          await computerVisionClient.analyzeImage(imageURL, {
            visualFeatures: ["Tags"],
          })
        ).tags;

        return tags;
      }
      const tags = await getImageTags(media.url);
      setImageTags(tags);
      setImageIsFoodItem(
        tags.findIndex((tag) => tag.name === "food") === -1 ? false : true
      );
    }
    detectFoodInImage();
  }, [media.url]);

  return (
    <Dialog fullScreen open onClose={handleClose}>
      {imageIsFoodItem ? (
        <>
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
          {imageTags && (
            <p
              style={{
                padding: "0 10px 0 10px",
              }}
            >
              <strong>Potential Image Tags: </strong>
              {formatTags(imageTags)}
            </p>
          )}
          <Autocomplete
            apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onPlaceSelected={(place) => {
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
        </>
      ) : (
        <>
          <AppBar sx={classes.appBar}>
            <Toolbar sx={classes.toolbar}>
              <ArrowBackIos onClick={discardPost} />
              <Typography align="center" variant="body1" sx={classes.title}>
                Image is not a Food Item
              </Typography>
              <Close onClick={discardPost} />
            </Toolbar>
          </AppBar>
          <Divider />
          <p></p>
          <Typography align="center" variant="body1">
            Please upload another picture that is a food item.
          </Typography>
        </>
      )}
    </Dialog>
  );
};

export default AddPostDialog;
