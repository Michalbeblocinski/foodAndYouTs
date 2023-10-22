import React from "react";
import Button from "@mui/material/Button";

interface ButtonCardProps {
  buttonLabel: string;
  onButtonClick: () => void;
}

export const ButtonCard: React.FC<ButtonCardProps> = ({
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <div className="h-163px bg-primaryOpacity relative mb-20px px-20px flex align-middle">
      <Button
        variant="contained"
        type="submit"
        style={{
          width: "100%",
          height: "75px",
          margin: "auto",
        }}
        sx={{
          border: "1px solid #B1A4A4",
          background: "#000",
          boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
          "&:hover": {
            background: "#161616",
          },
        }}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};
