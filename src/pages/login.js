import {
  Button,
  Card,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/shared/Seo";
import { useLoginPageStyles as classes } from "./../styles";
import GoogleIcon from "@mui/icons-material/Google";

import { AuthContext } from "./../auth";
import { useForm } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import isEmail from "validator/lib/isEmail";
import { GET_USER_EMAIL } from "../graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { AuthError } from "./signup";
import logo from "../images/logo.png";

function LoginPage() {
  const { loginWithEmailAndPassword } = React.useContext(AuthContext);
  const [getEmail] = useLazyQuery(GET_USER_EMAIL);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState } = useForm({
    mode: "onBlur",
  });
  const [showPassword, setPasswordVisibility] = React.useState(false);
  const [error, setError] = React.useState("");
  const hasPassword = Boolean(watch("password"));

  function togglePasswordVisibility() {
    setPasswordVisibility((prev) => !prev);
  }

  // Authenticate user via Firebase
  async function onSubmit(data) {
    try {
      setError("");
      const { input, password } = data;
      let email;
      if (!isEmail(input)) {
        email = await getUserEmail(input);
      } else {
        email = data.input;
      }
      await loginWithEmailAndPassword(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error logging in", error);
      handleError(error);
    }
  }

  // Get user email from Hasura
  async function getUserEmail(input) {
    const response = await getEmail({ variables: { input } });
    const email = response.data.users[0]?.email || "noemail";
    return email;
  }

  // Displays the errors from Firebase to user
  function handleError(error) {
    if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  return (
    <>
      <SEO title="Login" />
      <Box component="section" sx={classes.section}>
        <Box component="article">
          <Card sx={classes.card}>
            <Box src={logo} alt="Foodiegram" component="img" />

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="input"
                {...register("input", {
                  required: true,
                  minLength: 5,
                })}
                variant="filled"
                fullWidth
                label="Username, email, or phone"
                margin="dense"
                sx={classes.textField}
                autoComplete="username"
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
                type={showPassword ? "text" : "password"}
                margin="dense"
                sx={classes.textField}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment
                      position="end"
                      onClick={() => togglePasswordVisibility()}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </InputAdornment>
                  ),
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
                Log In
              </Button>
            </form>
            <Box sx={classes.orContainer}>
              <Box sx={classes.orLine} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </Box>
              <Box sx={classes.orLine} />
            </Box>
            <LoginWithGoogle color="secondary" />
            <AuthError error={error} />
            <Button fullWidth color="secondary">
              <Typography variant="caption">Forgot Password?</Typography>
            </Button>
          </Card>
          <Card sx={classes.signUpCard}>
            <Typography align="right" variant="body2">
              Don't have an account?
            </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" sx={classes.signUpButton}>
                Sign Up
              </Button>
            </Link>
          </Card>
        </Box>
      </Box>
    </>
  );
}

export function LoginWithGoogle({ color, iconColor = "#DB4437", variant }) {
  const { logInWithGoogle } = React.useContext(AuthContext);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  async function handleLogInWithGoogle() {
    try {
      setError("");
      await logInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google", error);
      setError(error);
    }
  }

  return (
    <>
      <Button fullWidth variant={variant} onClick={handleLogInWithGoogle}>
        <GoogleIcon sx={{ color: iconColor, marginRight: "5px" }} />
        Log In with Google
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
