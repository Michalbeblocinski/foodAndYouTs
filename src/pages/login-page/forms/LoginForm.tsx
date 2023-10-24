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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../store/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig/config";
import { UserApp } from "../../../utils/types/user";

type LoginFormValues = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { email, password } = values;
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (userCredential.user) {
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          let loggedUser: UserApp = {
            _id: userCredential.user.uid,
            username: userData.username,
            email: userData.email,
            lastName: userData.lastName,
            photoUrl: userData.photoUrl,
            ingredients: userData.ingredients,
            wantedIngredients: userData.wantedIngredients,
            recipes: userData.recipes,
            follows: userData.follows,
            role: userData.role,
            recipesDone: userData.recipesDone,
            recipesDoneStars: userData.recipesDoneStars || null,
          };
          dispatch(setLogin(loggedUser));
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Your email or password is incorrect. Please try again.");
    }
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email required"),
    password: yup.string().required("Password Required"),
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
          <Form className="items-center flex flex-col min-h-255 relative">
            <h1 className="text-xl mb-2">Sign into Your Account</h1>

            <ThemeProvider theme={theme}>
              <TextField
                onBlur={handleBlur}
                label="Email"
                variant="standard"
                value={values.email}
                onChange={handleChange}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                style={inputStyle}
                inputProps={{ style: { color: "#fff", padding: "6px" } }}
                InputLabelProps={{ style: labelStyle }}
              />
            </ThemeProvider>
            <ThemeProvider theme={theme}>
              <TextField
                onBlur={handleBlur}
                label="Password"
                type="password"
                variant="standard"
                value={values.password}
                onChange={handleChange}
                name="password"
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
            <Button
              variant="contained"
              type="submit"
              style={{ marginTop: "1rem" }}
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
