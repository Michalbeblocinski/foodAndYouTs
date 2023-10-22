import React, { useState } from "react";
import {
  Button,
  TextField,
  createTheme,
  ThemeProvider,
  Alert,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { ref } from "yup";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../../firebaseConfig/config";
import CloseIcon from "@mui/icons-material/Close";
import { FirebaseError } from "firebase/app";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../store/authSlice";

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  repeatpassword: string;
};

const initialValues: RegisterFormValues = {
  username: "",
  email: "",
  password: "",
  repeatpassword: "",
};

export const RegistrationForm: React.FC = () => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: RegisterFormValues) => {
    const { email, username, password } = values;
    try {
      const userCredential = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      if (!userCredential) {
        return;
      }
      const { user } = userCredential;
      dispatch(
        setLogin({
          _id: user.uid,
          username: username,
          email: email,
          lastName: null,
          photoUrl: null,
          ingredients: null,
          recipes: null,
          follows: [],
          role: "User",
        })
      );

      await createUserDocumentFromAuth(user, "User",{ username });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          alert("Cannot create user, email already in use");
        }
      }
    }
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username required"),
    email: yup.string().email("Invalid email").required("Email required"),
    password: yup
      .string()
      .required("Password Required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter and one digit"
      ),
    repeatpassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([ref("password")], "Passwords do not match"),
  });

  const inputStyle = {
    marginBottom: "1rem",
  };

  const labelStyle = {
    color: "#fff",
  };

  const legendStyle = {
    color: "#fff",
  };

  const theme = createTheme({
    components: {
      MuiInput: {
        styleOverrides: {
          underline: {
            "&:before": {
              borderBottomColor: "white",
            },
            "&:after": {
              borderBottomColor: "white",
            },
            "&:hover:before": {
              borderBottomColor: "white",
            },
          },
        },
      },
    },
  });

  return (
    <>
      {errorMessage && (
        <Alert
          severity="error"
          style={{ marginBottom: "1rem" }}
          className="absolute top-0 z-10 max-w-full"
          sx={{ borderRadius: "0px" }}
        >
          <div className=" pr-60px">
            {errorMessage}
            <Button
              onClick={() => setErrorMessage(null)}
              color="inherit"
              size="small"
              sx={{
                marginLeft: "auto",
                position: "absolute",
                top: "1px",
                right: "0px",
                background: "none",
              }}
            >
              <CloseIcon />
            </Button>
          </div>
        </Alert>
      )}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form className="flex items-center min-h-255 relative">
            <h1 className="absolute top-0 text-xl mb-2 left-[calc(50%-100px)]">
              Register Your Account
            </h1>
            {/* Left Column */}
            <div className="flex flex-col w-1/2 pr-4">
              <ThemeProvider theme={theme}>
                <TextField
                  onBlur={handleBlur}
                  label="Username"
                  variant="standard"
                  value={values.username}
                  onChange={handleChange}
                  name="username"
                  id="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  style={inputStyle}
                  inputProps={{ style: { color: "#fff", padding: "6px" } }}
                  InputLabelProps={{ style: labelStyle }}
                />
              </ThemeProvider>
              <ThemeProvider theme={theme}>
                <TextField
                  onBlur={handleBlur}
                  label="Email"
                  variant="standard"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                  id="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  style={inputStyle}
                  inputProps={{ style: { color: "#fff", padding: "6px" } }}
                  InputLabelProps={{ style: labelStyle }}
                />
              </ThemeProvider>
            </div>

            {/* Right Column */}
            <div className="flex flex-col w-1/2 pl-4">
              <ThemeProvider theme={theme}>
                <TextField
                  onBlur={handleBlur}
                  label="Password"
                  type="password"
                  variant="standard"
                  value={values.password}
                  onChange={handleChange}
                  name="password"
                  id="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  style={inputStyle}
                  inputProps={{ style: { color: "#fff", padding: "6px" } }}
                  InputLabelProps={{ style: labelStyle }}
                  InputProps={{
                    style: { color: "#fff" },
                  }}
                />
              </ThemeProvider>
              <ThemeProvider theme={theme}>
                <TextField
                  onBlur={handleBlur}
                  label="Confirm Password"
                  type="password"
                  variant="standard"
                  value={values.repeatpassword}
                  onChange={handleChange}
                  name="repeatpassword"
                  id="repeatpassword"
                  error={
                    Boolean(touched.repeatpassword) &&
                    Boolean(errors.repeatpassword)
                  }
                  helperText={touched.repeatpassword && errors.repeatpassword}
                  style={inputStyle}
                  inputProps={{ style: { color: "#fff", padding: "6px" } }}
                  InputLabelProps={{ style: labelStyle }}
                  InputProps={{
                    style: { color: "#fff" },
                  }}
                />
              </ThemeProvider>
            </div>

            {/* Button */}
            <Button
              variant="contained"
              type="submit"
              className="mt-4"
              sx={{
                position: "absolute",
                bottom: "0",
                border: "1px solid #B1A4A4",
                background: " #000",
                boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
                width: "100%",
                "&:hover": {
                  background: "#161616",
                },
              }}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
