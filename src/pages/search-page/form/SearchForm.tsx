import React from "react";
import { Button, TextField, createTheme, ThemeProvider } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";

interface SearchFormProps {
  getRecipesData: (item: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ getRecipesData }) => {
  const initialValues = {
    searchInput: "",
  };

  const validationSchema = yup.object().shape({
    searchInput: yup.string().required("Search input required"),
  });

  const inputStyle = {
    width: "calc(100% - 180px)",
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

  const handleSearchSubmit = (values: any) => {
    const stringSearchInput =
      typeof values === "string" ? values : String(values.searchInput);
    getRecipesData(stringSearchInput);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSearchSubmit}
    >
      {({ values, errors, touched, handleBlur, handleChange }) => (
        <Form className="flex  flex-row  relative justify-between items-start">
          <ThemeProvider theme={theme}>
            <TextField
              onBlur={handleBlur}
              label="Search"
              variant="standard"
              value={values.searchInput}
              onChange={handleChange}
              name="searchInput"
              id="searchInput"
              InputLabelProps={{ style: labelStyle }}
              error={
                Boolean(touched.searchInput) && Boolean(errors.searchInput)
              }
              helperText={touched.searchInput && errors.searchInput}
              style={inputStyle}
              inputProps={{
                style: { color: "#fff", padding: "6px", width: "80%" },
              }}
            />
          </ThemeProvider>

          <Button
            variant="contained"
            type="submit"
            sx={{
              maxWidth: "150px",
              border: "1px solid #B1A4A4",
              background: " #000",
              height: "50px",
              boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
              width: "100%",
              "&:hover": {
                background: "#161616",
              },
            }}
          >
            Search
          </Button>
        </Form>
      )}
    </Formik>
  );
};
