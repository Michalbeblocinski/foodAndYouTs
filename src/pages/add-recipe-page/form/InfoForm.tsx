import React, { useState } from "react";
import { Button, TextField, createTheme, ThemeProvider } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
type DescriptionProps = {
  onDescriptionChange: (title: string) => void;
  initialDescription: string;
};
type InfoFormInitialValues = {
  InfoInput: string;
};
export const InfoForm: React.FC<DescriptionProps> = ({
  onDescriptionChange,
  initialDescription,
}) => {
  const [description, setDescription] = useState<string>(initialDescription);
  const initialValues: InfoFormInitialValues = { InfoInput: description };
  const validationSchema = yup.object().shape({
    InfoInput: yup.string().required("Info input required"),
  });

  const inputStyle = {
    width: "100%",
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

  const handleInfoSubmit = (values: InfoFormInitialValues) => {
    const descriptionSubmit = values.InfoInput;
    onDescriptionChange(descriptionSubmit);
    setDescription(descriptionSubmit);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleInfoSubmit}
    >
      {({ values, errors, touched, handleBlur, handleChange }) => (
        <Form className="flex  flex-col  justify-between ">
          <ThemeProvider theme={theme}>
            <TextField
              multiline
              rows={9}
              onBlur={handleBlur}
              label="Description"
              variant="standard"
              value={values.InfoInput}
              onChange={handleChange}
              name="InfoInput"
              id="InfoInput"
              InputLabelProps={{ style: labelStyle }}
              error={Boolean(touched.InfoInput) && Boolean(errors.InfoInput)}
              helperText={touched.InfoInput && errors.InfoInput}
              style={inputStyle}
              InputProps={{
                style: {
                  color: "#fff",
                  width: "100%",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4b5563 transparent",
                },
              }}
            />
          </ThemeProvider>

          <Button
            variant="contained"
            type="submit"
            sx={{
              position: "absolute",
              width: "calc(100% - 40px)",
              bottom: "20px",
              border: "1px solid #B1A4A4",
              background: " #000",
              height: "50px",
              boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",

              "&:hover": {
                background: "#161616",
              },
            }}
          >
            Add description
          </Button>
        </Form>
      )}
    </Formik>
  );
};
