import React from "react";
import Button from "@mui/material/Button";

interface CustomButtonProps {
  buttonLabel: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ buttonLabel }) => {
  return (
    <Button
      variant="contained"
      type="submit"
      style={{
        width: "100%",
        height: "75px",
        margin: "auto",
        marginTop: "20px",
      }}
      sx={{
        outline: "none",
        border: "1px solid #B1A4A4",
        background: "#000",
        boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
        "&:hover": {
          background: "#161616",
        },
        "&:focus": {
          outline: "none",
          border: "none",
        },
      }}
    >
      {buttonLabel}
    </Button>
  );
};
