import React, { useState } from "react";
import {
  Button,
  TextField,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

type TitleProps = {
  onTitleChange: (title: string, time: number) => void;
};

export const TitleForm: React.FC<TitleProps> = ({ onTitleChange }) => {
  const [title, setTitle] = useState<string>("");

  const [time, setTime] = useState<number>(0);

  const initialValues = {
    TitleInput: title,
    TimeInput: time,

  };

  const validationSchema = yup.object().shape({
    TitleInput: yup.string().required("Title input required"),
    TimeInput: yup
        .number()
        .typeError("Only numbers")
        .required("Time input required")
        .positive("Time must be positive"),

  });

  const inputStyle = {
    width: "calc(50% - 40px)",
  };
  
  const inputStyle2 = {
    width: "40px",
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

  const handleTitleSubmit = (values: any) => {
    setTitle(values.TitleInput);
    setTime(values.TimeInput);
    onTitleChange(values.TitleInput, values.TimeInput);
  };

  return (
      <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleTitleSubmit}
      >

        {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form className="flex flex-row relative justify-between items-start">
              <ThemeProvider theme={theme}>
                <TextField
                    onBlur={handleBlur}
                    label="Title"
                    variant="standard"
                    value={values.TitleInput}
                    onChange={handleChange}
                    name="TitleInput"
                    id="TitleInput"
                    InputLabelProps={{ style: labelStyle }}
                    error={Boolean(touched.TitleInput) && Boolean(errors.TitleInput)}
                    helperText={touched.TitleInput && errors.TitleInput}
                    style={inputStyle}
                    inputProps={{
                      style: {
                        color: "#fff",
                        padding: "6px",
                        width: "60%",
                      },
                    }}
                />

                <TextField
                    onBlur={handleBlur}
                    label="Time"
                    variant="standard"
                    value={values.TimeInput}
                    onChange={handleChange}
                    name="TimeInput"
                    id="TimeInput"
                    InputLabelProps={{ style: labelStyle }}
                    error={Boolean(touched.TimeInput) && Boolean(errors.TimeInput)}
                    helperText={touched.TimeInput && errors.TimeInput}
                    style={inputStyle2}
                    inputProps={{
                      style: { color: "#fff", padding: "6px", width: "60%" },
                    }}
                />
              </ThemeProvider>

              <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    maxWidth: "15%",
                    border: "1px solid #B1A4A4",
                    background: "#000",
                    height: "50px",
                    boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
                    width: "100%",
                    "&:hover": {
                      background: "#161616",
                    },
                  }}
              >
                ADD
              </Button>
            </Form>
        )}
      </Formik>
  );
};
