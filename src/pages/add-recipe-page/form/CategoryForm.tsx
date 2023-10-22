import React, { useState } from "react";
import {
    Button,
    createTheme,
    ThemeProvider,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

type TitleProps = {
    onTitleChange: ( difficulty: string,category:string) => void;
};

export const CategoryForm: React.FC<TitleProps> = ({ onTitleChange }) => {
    const [difficulty, setDifficulty] = useState<string>("Easy");
    const [category, setCategory] = useState<string>("Lunch");


    const initialValues = {
        DifficultyInput: difficulty,
        CategoryInput: category,
    };

    const validationSchema = yup.object().shape({
        DifficultyInput: yup.string().required("Difficulty input required"),
        CategoryInput: yup.string().required("Category input required"),
    });


    const inputStyle = {
        width: "25vw",
        maxWidth: "240px",
        color: "white",

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

        setDifficulty(values.DifficultyInput);
        onTitleChange( values.DifficultyInput,values.CategoryInput);
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


                        <FormControl variant="standard">
                            <InputLabel style={labelStyle}>Difficulty</InputLabel>
                            <Field
                                as={Select}
                                name="DifficultyInput"
                                id="DifficultyInput"
                                label="Difficulty"
                                className="white-select"
                                error={
                                    Boolean(touched.DifficultyInput) &&
                                    Boolean(errors.DifficultyInput)
                                }
                                style={inputStyle}

                            >
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Field>
                        </FormControl>
                        <FormControl variant="standard">
                            <InputLabel style={labelStyle}>Category</InputLabel>
                            <Field
                                as={Select}
                                name="CategoryInput"
                                id="CategoryInput"
                                label="Category"
                                className="white-select"
                                error={
                                    Boolean(touched.DifficultyInput) &&
                                    Boolean(errors.DifficultyInput)
                                }
                                style={inputStyle}

                            >
                                <MenuItem value="Breakfast">Breakfast</MenuItem>
                                <MenuItem value="Lunch">Lunch</MenuItem>
                                <MenuItem value="Supper">Supper</MenuItem>
                            </Field>
                        </FormControl>
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
