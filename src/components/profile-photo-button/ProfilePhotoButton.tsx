import React, { useState } from "react";
import Button from "@mui/material/Button";
import { db, storage } from "../../firebaseConfig/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { UserApp } from "../../utils/types/user";
import { useDispatch } from "react-redux";
import { changeUserPhotoUrl } from "../../store/authSlice";

interface ProfilePhotoButtonProps {
  imageUrl: string;
  buttonLabel: string;
  currentUser?: UserApp | null;
  recipeId?: string;
  onPhotoRecipeChange?: (title: string) => void;
}

export const ProfilePhotoButton: React.FC<ProfilePhotoButtonProps> = ({
  imageUrl,
  buttonLabel,
  currentUser,
  recipeId,
  onPhotoRecipeChange,
}) => {
  const [realTimeUrl, setRealTimeUrl] = useState<string>(imageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    validateFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedFile && currentUser) {
      try {
        const fileRef = ref(storage, `profile-photos/${selectedFile?.name}`);
        await uploadBytes(fileRef, selectedFile);
        const url = await getDownloadURL(fileRef);
        const docRef = await doc(db, "users", currentUser._id);

        const updatedPhotoUrl = {
          photoUrl: url,
        };

        await updateDoc(docRef, updatedPhotoUrl);
        dispatch(changeUserPhotoUrl(updatedPhotoUrl));
        setRealTimeUrl(updatedPhotoUrl.photoUrl);
      } catch (error) {
        console.error("Error adding photo", error);
      }
    }

    if (selectedFile && recipeId && onPhotoRecipeChange) {
      try {
        const fileRef = ref(storage, `recipe-photos/${selectedFile?.name}`);
        await uploadBytes(fileRef, selectedFile);
        const url = await getDownloadURL(fileRef);
        setRealTimeUrl(url);
        onPhotoRecipeChange(url);
      } catch (error) {
        console.error("Error adding photo", error);
      }
    }
  };

  const validateFile = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
      } else if (file.size > 1000000) {
        alert("File size is too large");
      } else {
        setSelectedFile(file);
        alert(`Success. If you want to change click "CHANGE PHOTO"`);
      }
    }
  };

  return (
    <div className="lg:col-span-4 h-350px bg-primaryOpacity p-20px relative">
      <img
        src={realTimeUrl}
        alt="profile"
        className="object-contain h-210px w-356px mx-auto"
      />
      <form onSubmit={handleSubmit}>
        <Button
          type="submit"
          variant="contained"
          style={{
            marginTop: "1rem",
            position: "absolute",
            bottom: "70px",
            width: "calc(100% - 40px)",
          }}
          sx={{
            border: "1px solid #B1A4A4",
            background: "#000",
            boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
            "&:hover": {
              background: "#161616",
            },
          }}
        >
          CHOOSE FILE
          <input
            id="fileInput"
            accept="image/jpg, image/jpeg, image/jpg"
            multiple
            type="file"
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            onChange={handleFileChange}
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          style={{
            marginTop: "1rem",
            position: "absolute",
            bottom: "20px",
            width: "calc(100% - 40px)",
            cursor: `${!selectedFile ? "not-allowed" : "pointer"}`,
          }}
          sx={{
            border: "1px solid #B1A4A4",
            background: `${!selectedFile ? "#200" : "#000"}`,
            boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
            "&:hover": {
              background: `${!selectedFile ? "#200" : "#161616"}`,
            },
          }}
        >
          {buttonLabel}
        </Button>
      </form>
    </div>
  );
};
