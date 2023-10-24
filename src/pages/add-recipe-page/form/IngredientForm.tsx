import React, { useState } from "react";
import { Button, TextField, createTheme, ThemeProvider } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

type IngredientProps = {
  onIngredientChange: (ingredient: string, weight: number) => void;
};

export const IngredientForm: React.FC<IngredientProps> = ({
  onIngredientChange,
}) => {
  const [ingredient, setIngredient] = useState<string>("");
  const [weight, setWeight] = useState<number | undefined>(0);

  const initialValues = {
    IngredientInput: ingredient,
    WeightInput: weight,
  };

  const validationSchema = yup.object().shape({
    IngredientInput: yup.string().required("Ingredient input required"),
    WeightInput: yup
      .number()
      .typeError("Weight must be a number")
      .required("Weight input required"),
  });

  const inputStyle = {
    width: "80%",
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
              width: "80%",
            },
            "&:after": {
              borderBottomColor: "white",
              width: "80%",
            },
            "&:hover:before": {
              borderBottomColor: "white",
              width: "80%",
            },
          },
        },
      },
    },
  });

  const handleIngredientSubmit = (values: any) => {
    setIngredient(values.IngredientInput);
    setWeight(values.WeightInput);
    onIngredientChange(values.IngredientInput, values.WeightInput);
  };

  return (
    <div className="h-163px bg-primaryOpacity relative mb-20px px-20px flex align-middle">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleIngredientSubmit}
      >
        {({ errors, touched, handleBlur, handleChange }) => (
          <Form className="flex  flex-col  relative justify-between items-center w-full pb-20px pt-5px">
            <ThemeProvider theme={theme}>
              <div className="flex flex-row justify-between items-center w-full">
                <Field
                  as={TextField}
                  onBlur={handleBlur}
                  label="Ingredient"
                  variant="standard"
                  name="IngredientInput"
                  id="IngredientInput"
                  InputLabelProps={{ style: labelStyle }}
                  error={touched.IngredientInput && errors.IngredientInput}
                  helperText={touched.IngredientInput && errors.IngredientInput}
                  style={inputStyle}
                  inputProps={{
                    style: { color: "#fff", padding: "6px", width: "80%" },
                  }}
                />

                <Field
                  as={TextField}
                  onBlur={handleBlur}
                  label="Weight (grams)"
                  variant="standard"
                  name="WeightInput"
                  id="WeightInput"
                  InputLabelProps={{ style: labelStyle }}
                  error={touched.WeightInput && errors.WeightInput}
                  helperText={touched.WeightInput && errors.WeightInput}
                  style={inputStyle}
                  inputProps={{
                    style: { color: "#fff", padding: "6px", width: "80%" },
                  }}
                />
              </div>
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
