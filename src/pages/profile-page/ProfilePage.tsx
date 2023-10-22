import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import profile from "../../utils/profile.png";
import { SmallRecipeCard } from "../../components/small-recipe-card";
import { useParams } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/config";
import { UserApp } from "../../utils/types/user";
import { ProfilePhotoFollowButton } from "../../components/profile-photo-follow-button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Recipe } from "../../utils/types/recipe";
import { changeUserFollows, getUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

export const ProfilePage: React.FC = () => {
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [smallRecipes, setSmallRecipes] = useState<Array<Recipe>>([]);
  const [userData, setUserData] = useState<UserApp | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>(profile);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recipesPerPage = 6;
  const dispatch = useDispatch();
  const nextPage = () => {
    if (currentPage < Math.ceil(smallRecipes.length / recipesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (smallRecipes.length < 7) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  }, [smallRecipes]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const fetchData = async () => {
    let colRef = collection(db, "recipes");
    let docsSnap = await getDocs(colRef);
    let recipesData: Array<Recipe> = [];
    docsSnap.forEach((doc) => {
      const recipeData: Recipe = {
        _id: doc.id,
        ...doc.data(),
      } as Recipe;
      if (recipeData.user._id === id) {
        recipesData.push(recipeData);
      }
    });
    setSmallRecipes(recipesData);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const currentUser = useSelector(getUser);
  const { id } = useParams();

  const handleFollow = async () => {
    try {
      if (currentUser && id) {
        const myProfileRef = doc(db, "users", currentUser._id);
        const userProfileRef = doc(db, "users", id);
        const myProfileSnapshot = await getDoc(myProfileRef);
        if (myProfileSnapshot.exists()) {
          let myProfileData: UserApp = myProfileSnapshot.data() as UserApp;
          if (myProfileData.follows?.includes(id)) {
            alert("You have already followed this account");
          } else if (id === currentUser._id) {
            alert("This is your account");
          } else {
            await updateDoc(myProfileRef, { follows: arrayUnion(id) });
            await updateDoc(userProfileRef, {
              followers: arrayUnion(currentUser._id),
            });
            dispatch(changeUserFollows(id));
            alert("Follow added successfully");
          }
        }
      }
    } catch (error) {
      return console.error("Error updating profile", error);
    }
  };

  const getData = async () => {
    try {
      const uid = id as string;
      const userDocRef = doc(db, "users", uid);
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data() as UserApp);
      }
    } catch (error) {
      console.error("Error druing get data", error);
    }
  };
  useEffect(() => {
    if (userData && userData.photoUrl) setUserPhoto(userData?.photoUrl);
  }, [userData]);
  useEffect(() => {
    getData();
  }, [id]);

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto px-4 relative z-10 my-37px"
        style={{ maxWidth: "1060px" }}
      >
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          <div className="lg:col-span-6 h-350px flex flex-col text-white">
            <div className="bg-primaryOpacity w-full h-220px mb-20px p-20px">
              <h1 className="text-3xl mb-11px">General Information</h1>
              <p className="text-lg text-myGrey mb-5px">Name and Last Name:</p>
              <h2 className="text-lg mb-5px">
                {" "}
                {userData?.username && <span>{userData.username}</span>}
                <span> </span>
                {userData?.lastName && <span>{userData.lastName}</span>}
              </h2>
              <p className="text-lg mb-5px text-myGrey">Email:</p>
              <h2 className="text-lg mb-5px">
                {userData?.email && <span>{userData.email}</span>}
              </h2>
            </div>
            <div className="bg-primaryOpacity w-full h-110px p-20px text-center">
              <p className="font-quote text-4xl">Man is what he eats. </p>
              <p className="font-quote text-4xl">- Ludwig Feuerbach</p>
            </div>
          </div>
          <ProfilePhotoFollowButton
            imageUrl={userPhoto}
            handleFollow={handleFollow}
          />
        </div>
        <div className="grid gap-24px lg:grid-cols-3 mb-24px">
          {smallRecipes
            .slice(
              (currentPage - 1) * recipesPerPage,
              currentPage * recipesPerPage
            )
            .map((recipe) => (
              <SmallRecipeCard
                key={recipe._id}
                mainPhoto={recipe.photoUrl}
                title={recipe.title}
                description={recipe.description}
                stars={recipe.stars}
                cookingTime={recipe.time}
                _id={recipe._id}
                numberOfOpinions={recipe.numberOfGrades}
                difficulty={recipe.difficulty}
              />
            ))}
        </div>
        <div className="flex justify-center mt-4">
          {showButtons && (
            <button
              onClick={prevPage}
              className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
              style={{
                width: "80px",
                height: "50px",
                margin: "auto",
                border: "1px solid #B1A4A4",
                background: "#000",
                boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
              }}
            >
              <ArrowBackIcon />
            </button>
          )}

          {showButtons && (
            <button
              onClick={nextPage}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              style={{
                width: "80px",
                height: "50px",
                margin: "auto",
                border: "1px solid #B1A4A4",
                background: "#000",
                boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
              }}
            >
              <ArrowForwardIcon />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
