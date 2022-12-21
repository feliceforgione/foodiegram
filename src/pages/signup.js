import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { HighlightOff, CheckCircleOutline } from "@mui/icons-material";
import { useSignUpPageStyles as classes } from "./../styles";
import SEO from "../components/shared/Seo";
import { LoginWithGoogle } from "./login";
import { AuthContext } from "./../auth";
import { useForm } from "react-hook-form";
import isEmail from "validator/lib/isEmail";
import { useLazyQuery } from "@apollo/client";
import { CHECK_IF_USERNAME_TAKEN } from "../graphql/queries";
import logo from "../images/logo.png";

function SignUpPage() {
  const { signUpWithEmailAndPassword } = React.useContext(AuthContext);
  const { register, handleSubmit, formState } = useForm({ mode: "onBlur" });
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const [getUsername] = useLazyQuery(CHECK_IF_USERNAME_TAKEN);

  async function onSubmit(data) {
    try {
      setError("");
      await signUpWithEmailAndPassword(data);
      navigate("/");
    } catch (error) {
      console.log("Error signing up", error);
      handleError(error);
    }
  }

  // Displays the errors from Firebase to user
  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError("Username already taken");
    } else if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  // Checks if username exists in apollo database
  async function validateUsername(username) {
    const { data } = await getUsername({ variables: { username } });
    const isUsernameValid = data.users.length === 0;
    return isUsernameValid;
  }

  // Icons used to visually display validation in input fields
  const errorIcon = (
    <InputAdornment position="end">
      <HighlightOff style={{ color: "red", height: 30, width: 30 }} />
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment position="end">
      <CheckCircleOutline style={{ color: "#ccc", height: 30, width: 30 }} />
    </InputAdornment>
  );

  return (
    <>
      <SEO title="Sign up" />
      <Box component="section" sx={classes.section}>
        <Box component="article">
          <Card sx={classes.card}>
            <Box />
            <Box src={logo} alt="Foodiegram" component="img" />
            <Typography sx={classes.cardHeaderSubHeader}>
              Sign up to see food photos and videos from your friends.
            </Typography>
            <LoginWithGoogle
              color="primary"
              iconColor="white"
              variant="contained"
            />
            <Box sx={classes.orContainer}>
              <Box sx={classes.orLine} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </Box>
              <Box sx={classes.orLine} />
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="email"
                {...register("email", {
                  required: true,
                  validate: (input) => isEmail(input),
                })}
                variant="filled"
                fullWidth
                label="Email"
                type="email"
                margin="dense"
                sx={classes.textField}
                InputProps={{
                  endAdornment: formState.errors.email
                    ? errorIcon
                    : formState.touchedFields.email && validIcon,
                }}
              />
              <TextField
                name="name"
                {...register("name", {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                })}
                variant="filled"
                fullWidth
                label="Full Name"
                margin="dense"
                sx={classes.textField}
                InputProps={{
                  endAdornment: formState.errors.name
                    ? errorIcon
                    : formState.touchedFields.name && validIcon,
                }}
              />
              <TextField
                name="username"
                {...register("username", {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  validate: async (input) => await validateUsername(input),
                  pattern: /^[a-zA-Z0-9_.]*$/,
                })}
                variant="filled"
                fullWidth
                label="Username"
                margin="dense"
                sx={classes.textField}
                autoComplete="username"
                InputProps={{
                  endAdornment: formState.errors.username
                    ? errorIcon
                    : formState.touchedFields.username && validIcon,
                }}
              />
              <TextField
                name="password"
                {...register("password", {
                  required: true,
                  minLength: 5,
                })}
                variant="filled"
                fullWidth
                label="Password"
                type="password"
                margin="dense"
                sx={classes.textField}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: formState.errors.password
                    ? errorIcon
                    : formState.touchedFields.password && validIcon,
                }}
              />
              <Button
                variant="contained"
                fullWidth
                color="primary"
                sx={classes.button}
                type="submit"
                disabled={!formState.isValid || formState.isSubmitting}
              >
                Sign Up
              </Button>
            </form>
            <AuthError error={error} />
          </Card>
          <Card sx={classes.loginCard}>
            <Typography align="right" variant="body2">
              Don't have an account?
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" sx={classes.loginButton}>
                Log in
              </Button>
            </Link>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export function AuthError({ error }) {
  return (
    Boolean(error) && (
      <Typography
        align="center"
        gutterBottom
        variant="body2"
        style={{ color: "red" }}
      >
        {error}
      </Typography>
    )
  );
}

export default SignUpPage;
