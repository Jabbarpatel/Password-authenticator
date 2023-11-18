import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMutation } from "react-query";
import Swal from "sweetalert2";
import axios from "axios";
import * as yup from "yup";
import UserPage from "./UserPage";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LoginForm() {
  const [userDetailes, setUserDetailes] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().required("This field is required"),
    password: yup.string().required("This field is required"),
  });

  const isValidInput = async () => {
    try {
      await schema.validate(userDetailes, { abortEarly: false });
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleOnChange = (e, field) => {
    setUserDetailes((prevData) => ({ ...prevData, [field]: e.target.value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const { data: isRecordFound, mutate: sendData } = useMutation(
    ({ userDetailes }) =>
      axios
        .post(`http://localhost:3002/api/user`, userDetailes)
        .then((res) => res.data)
  );

  const handleSave = async () => {
    const valid = await isValidInput();
    if (valid) {
      sendData({ userDetailes: userDetailes });
    }
  };

  useEffect(() => {
    if (isRecordFound) {
      console.log(isRecordFound);
    }
  }, [isRecordFound]);

  useEffect(() => {
    if (isRecordFound) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      if (isRecordFound.data === "success") {
        setUserDetailes({ email: "", password: "" });
        Toast.fire({
          icon: "success",
          title: "Loged in successfully",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to login",
        });
        if (isRecordFound.error1 && isRecordFound.error2) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: isRecordFound.error1,
            password: isRecordFound.error2,
          }));
        } else if (isRecordFound.field === "email") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: isRecordFound.error,
          }));
        } else if (isRecordFound.field === "password") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: isRecordFound.error,
          }));
        }
      }
    }
  }, [isRecordFound]);

  return (
    <div>
      <UserPage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={userDetailes.email}
                onChange={(e) => handleOnChange(e, e.target.name)}
                helperText={errors.email}
                error={Boolean(errors.email)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userDetailes.password}
                onChange={(e) => handleOnChange(e, e.target.name)}
                helperText={errors.password}
                error={Boolean(errors.password)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSave}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link variant="body2" style={{ cursor: "pointer" }}>
                    Forgot Password ?
                  </Link>
                </Grid>
                <Link
                  variant="body2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setIsModalOpen(true);
                    setErrors({});
                    setUserDetailes({
                      email: "",
                      password: "",
                    });
                  }}
                >
                  Change Password ?
                </Link>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
