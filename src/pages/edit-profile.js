import { Menu } from "@mui/icons-material";
import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "./../components/shared/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "./../App";
import { useQuery } from "@apollo/client";
import { GET_EDIT_USER_PROFILE } from "./../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";
import isMobilePhone from "validator/lib/isMobilePhone";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "../graphql/mutations";
import { AuthContext } from "./../auth";
import UploadWidget from "../components/shared/UploadWidget";
import { EDIT_USER_AVATAR } from "./../graphql/mutations";

function EditProfilePage() {
  const { currentUserId } = React.useContext(UserContext);
  let { pathname } = useLocation();
  const navigate = useNavigate();
  const classes = useEditProfilePageStyles();

  const [showDrawer, setDrawer] = React.useState(false);

  // Get current User
  const variables = { id: currentUserId };
  const { loading, data } = useQuery(GET_EDIT_USER_PROFILE, {
    variables,
  });

  if (loading) return <LoadingScreen />;

  let currentUser = data.users_by_pk;

  function handleToggleDrawer() {
    setDrawer((prev) => !prev);
  }

  function handleSelected(index) {
    switch (index) {
      case 0:
        return pathname.includes("edit");
      default:
        break;
    }
  }

  function handleListClick(index) {
    switch (index) {
      case 0:
        navigate("/accounts/edit");
        break;
      default:
        break;
    }
  }

  const options = ["Edit Profile", "Change Password"];

  const drawer = (
    <List
      sx={{
        "& .Mui-selected": { ...classes.listItemSelected },
      }}
    >
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );
  return (
    <Layout title="Edit Profile">
      <Box component="section" sx={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          sx={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              sx={{
                "& .MuiDrawer-paperAnchorLeft": { ...classes.temporaryDrawer },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            sx={{
              ...classes.permanentDrawerRoot,
              display: { xs: "none", sm: "block" },
            }}
          >
            <Drawer
              variant="permanent"
              open={showDrawer}
              PaperProps={{ sx: classes.permanentDrawerPaper }}
              sx={classes.permanentDrawerRoot}
            >
              {drawer}
            </Drawer>
          </Box>
        </nav>
        <Box component="main">
          {pathname.includes("edit") && <EditUserInfo user={currentUser} />}
        </Box>
      </Box>
    </Layout>
  );
}

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();
  const { updateEmail } = React.useContext(AuthContext);
  const [editUser] = useMutation(EDIT_USER);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [error, setError] = React.useState({ type: "", message: "" });
  const [openSnackbar, setSnackbar] = React.useState(false);
  const navigate = useNavigate();

  // Validation
  const { register, handleSubmit, formState } = useForm({
    mode: "onBlur",
  });
  async function onSubmit(data) {
    try {
      setError({ type: "", message: "" });
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      const updatedUser = await editUser({ variables });

      console.log(updatedUser);
      setSnackbar(true);
      navigate(`/${updatedUser.data.update_users_by_pk.username}`);
    } catch (error) {
      console.error("Error updating profile", error);
      handleError(error);
    }
  }

  // Displays the errors from Firebase to user
  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError({ type: "username", message: "Username already taken" });
    } else if (error.code.includes("auth")) {
      setError({ type: "email", message: error.message });
    }
  }

  //Cloudinary
  async function handleOnUpload(error, result, widget) {
    if (error) {
      console.log(error);
      widget.close({
        quiet: true,
      });
      return;
    }

    console.log("uploaded", result.info.url);
    const variables = { profileImage: result.info.url, id: user.id };
    await editUserAvatar({ variables });
  }
  return (
    <Box component="section" sx={classes.container}>
      <Box sx={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={user.profile_image} />
        <Box sx={classes.justifySelfStart}>
          <Typography sx={classes.typography}>{user.username}</Typography>

          <UploadWidget onUpload={handleOnUpload} preset="avatar">
            {({ open }) => {
              function handleOnClick(e) {
                e.preventDefault();
                open();
              }
              return (
                <Typography
                  color="primary"
                  variant="body2"
                  sx={classes.typographyChangePic}
                  onClick={handleOnClick}
                >
                  Change Profile Photo
                </Typography>
              );
            }}
          </UploadWidget>
        </Box>
      </Box>

      <Box
        component={"form"}
        sx={classes.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <SectionItem
          text="Name"
          formItem={user.name}
          name="name"
          inputRef={{
            ...register("name", {
              required: true,
              minLength: 5,
              maxLength: 20,
            }),
          }}
        />
        <SectionItem
          text="Username"
          error={error}
          formItem={user.username}
          name="username"
          inputRef={{
            ...register("username", {
              required: true,
              minLength: 5,
              maxLength: 20,
              pattern: /^[a-zA-Z0-9_.]*$/,
            }),
          }}
        />
        <SectionItem
          text="Website"
          formItem={user.website}
          name="website"
          inputRef={{
            ...register("website", {
              validate: (input) =>
                Boolean(input)
                  ? isURL(input, {
                      protocols: ["http", "https"],
                      require_protocol: true,
                    })
                  : true,
            }),
          }}
        />
        <Box sx={classes.sectionItem}>
          <Box component="aside">
            <Typography sx={classes.bio}>Bio</Typography>
          </Box>
          <TextField
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            defaultValue={user.bio}
            name="bio"
            {...register("bio", {
              maxLength: 120,
            })}
          />
        </Box>
        <Box sx={classes.sectionItem}>
          <Box />
          <Typography color="textSecondary" sx={classes.justifySelfStart}>
            Personal Information
          </Typography>
        </Box>
        <SectionItem
          error={error}
          text="Email"
          formItem={user.email}
          name="email"
          inputRef={{
            ...register("email", {
              required: true,
              minLength: 5,
              maxLength: 20,
              validate: (input) => isEmail(input),
            }),
          }}
        />
        <SectionItem
          text="Phone Number"
          formItem={user.phone_number}
          name="phoneNumber"
          inputRef={{
            ...register("phoneNumber", {
              validate: (input) =>
                Boolean(input) ? isMobilePhone(input) : true,
            }),
          }}
        />
        <Box sx={classes.sectionItem}>
          <Box />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={classes.justifySelfStart}
            disabled={!formState.isValid || formState.isSubmitting}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        TransitionComponent={Slide}
        message={<span>Profile Updated</span>}
        onClose={() => setSnackbar(false)}
      />
    </Box>
  );
}

function SectionItem({ type = "text", text, formItem, inputRef, name, error }) {
  const classes = useEditProfilePageStyles();

  return (
    <Box sx={classes.sectionItemWrapper}>
      <Box component="aside">
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography sx={classes.typography} alighn="right">
            {text}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <Typography sx={classes.typography}>{text}</Typography>
        </Box>
      </Box>
      <TextField
        {...inputRef}
        name={name}
        variant="outlined"
        fullWidth
        defaultValue={formItem}
        type={type}
        sx={classes.textField}
        inputProps={{ sx: classes.textFieldInput }}
        helperText={error?.type === name && error.message}
        error={error?.type === name}
      />
    </Box>
  );
}

export default EditProfilePage;
