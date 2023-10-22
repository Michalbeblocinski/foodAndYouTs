import React, { useState } from "react";
import { Button, TextField, createTheme, ThemeProvider } from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
type IngredientProps = {
  onIngredientChange: (Ingredient: string) => void;
};
export const IngredientForm: React.FC<IngredientProps> = ({
  onIngredientChange,
}) => {
  const [Ingredient, setIngredient] = useState<string>("");

  const initialValues = {
    IngredientInput: Ingredient,
  };

  const validationSchema = yup.object().shape({
    IngredientInput: yup.string().required("Ingredient input required"),
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

  const handleIngredientSubmit = (value: any) => {
    setIngredient(value);
    onIngredientChange(value.IngredientInput);
  };

  return (
    <div className="h-163px bg-primaryOpacity relative mb-20px px-20px flex align-middle">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleIngredientSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form className="flex  flex-col  relative justify-between items-center w-full pb-20px pt-5px">
            <ThemeProvider theme={theme}>
              <TextField
                onBlur={handleBlur}
                label="Ingredient"
                variant="standard"
                value={values.IngredientInput}
                onChange={handleChange}
                name="IngredientInput"
                id="IngredientInput"
                InputLabelProps={{ style: labelStyle }}
                error={
                  Boolean(touched.IngredientInput) &&
                  Boolean(errors.IngredientInput)
                }
                helperText={touched.IngredientInput && errors.IngredientInput}
                style={inputStyle}
                inputProps={{
                  style: { color: "#fff", padding: "6px", width: "100%" },
                }}
              />
            </ThemeProvider>

            <Button
              variant="contained"
              type="submit"
              sx={{
                maxWidth: "100%",
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
              Add ingredient
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
