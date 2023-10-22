import React from "react";
import Button from "@mui/material/Button";

interface ProfilePhotoFollowButtonProps {
  imageUrl: string;
  handleFollow?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProfilePhotoFollowButton: React.FC<
  ProfilePhotoFollowButtonProps
> = ({ imageUrl, handleFollow }) => {
  return (
    <div className="lg:col-span-4 h-350px bg-primaryOpacity p-20px relative">
      <img
        src={imageUrl}
        alt="profile"
        className="object-contain h-210px w-356px mx-auto"
      />

      <Button
        variant="contained"
        style={{
          marginTop: "1rem",
          position: "absolute",
          bottom: "20px",
          width: "calc(100% - 40px)",
          height: "80px",
        }}
        sx={{
          border: "1px solid #B1A4A4",
          background: "#000",
          boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
          "&:hover": {
            background: "#161616",
          },
        }}
        onClick={handleFollow}
      >
        Follow
      </Button>
    </div>
  );
};
