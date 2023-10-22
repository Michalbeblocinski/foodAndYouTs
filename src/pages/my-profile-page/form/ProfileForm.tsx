import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextField, createTheme, ThemeProvider, Button } from "@mui/material";
import { UserApp } from "../../../utils/types/user";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig/config";
import { useDispatch } from "react-redux";
import { changeUserBasicCredentials } from "../../../store/authSlice";

type UserChangeValues = {
  username: string;
  lastName: string | null;
  email: string;
};
type CurrentUser = {
  currentUser: UserApp;
};

export const GeneralInfoForm: React.FC<CurrentUser> = ({ currentUser }) => {
  const dispatch = useDispatch();
  let lastname: string = "";
  if (currentUser.lastName) {
    lastname = currentUser.lastName;
  }
  const initialValues = {
    username: currentUser.username,
    lastName: lastname,
    email: currentUser.email,
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const onSubmit = async (values: UserChangeValues) => {
    try {
      const docRef = doc(db, "users", currentUser._id);
      if (
        !values.username ||
        values.username === null ||
        values.username === ""
      ) {
        values.username = currentUser.username;
      }
      if (
        !values.lastName ||
        values.lastName === null ||
        values.lastName === ""
      ) {
        values.lastName = currentUser.lastName;
      }
      if (!values.email || values.email === null || values.email === "") {
        values.email = currentUser.email;
      }

      const updatedData = {
        username: values.username,
        lastName: values.lastName,
        email: values.email,
      };

      await updateDoc(docRef, updatedData);
      dispatch(changeUserBasicCredentials(updatedData));
      alert("data updated");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const inputStyle = {
    marginBottom: "1rem",
  };

  const labelStyle = {
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
    <div className="lg:col-span-6 h-350px bg-primaryOpacity p-20px">
      <ThemeProvider theme={theme}>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form className=" flex flex-col min-h-full relative">
              <h1 className="mb-2 text-white text-2xl">General Information</h1>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TextField
                  type="text"
                  id="username"
                  name="username"
                  label="First Name"
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  style={{ ...inputStyle, width: "48%" }}
                  InputProps={{ style: { color: "#fff", padding: "6px" } }}
                  InputLabelProps={{ style: labelStyle }}
                />

                <TextField
                  type="text"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="standard"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  style={{ ...inputStyle, width: "48%" }}
                  InputProps={{ style: { color: "#fff", padding: "6px" } }}
                  InputLabelProps={{ style: labelStyle }}
                />
              </div>

              <TextField
                type="email"
                id="email"
                name="email"
                label="Email"
                variant="standard"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                style={{
                  ...inputStyle,
                  width: "100%",
                  position: "absolute",
                  top: "46%",
                }}
                InputProps={{ style: { color: "#fff", padding: "6px" } }}
                InputLabelProps={{ style: labelStyle }}
              />

              <Button
                type="submit"
                variant="contained"
                style={{ marginTop: "3rem" }}
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
                Edit
              </Button>
            </Form>
          )}
        </Formik>
      </ThemeProvider>
    </div>
  );
};
