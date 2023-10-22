import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/config";
import { Recipe } from "../../utils/types/recipe";
import starWhite from "../../utils/starWhite.svg";
import starBorderOnly from "../../utils/starBorderOnly.svg";
import { useSelector } from "react-redux";
import { getUser } from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";

export const RecipePage: React.FC = () => {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState<Recipe | undefined>(undefined);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [numberOfStarsState, setNumberOfStarsState] = useState<number>(5);
  const [StarsState, setStarsState] = useState<number>(5);

  const currentUser: UserApp = useSelector(getUser) as UserApp;

  useEffect(() => {
    const getData = async () => {
      try {
        const uid = id as string;
        const recipeDocRef = doc(db, "recipes", uid);
        const recipeSnapshot = await getDoc(recipeDocRef);
        if (recipeSnapshot.exists()) {
          const recipeDataFromFirebase = recipeSnapshot.data() as Recipe;
          setRecipeData(recipeDataFromFirebase);
          if (recipeDataFromFirebase.numberOfGrades !== undefined) {
            setNumberOfStarsState(recipeDataFromFirebase.numberOfGrades);
          }
          setStarsState(recipeDataFromFirebase.stars);
        }
      } catch (error) {
        console.error("Error druing get data", error);
      }
    };
    getData();
  }, [id]);

  if (!recipeData) {
    return <div className="text-white">Loading...</div>;
  }

  const handleGiveGrade = async (value: number) => {
    try {
      if (recipeData.recipeGradesGivers.includes(currentUser._id)) {
        alert("You cant give Grade second time");
      } else if (recipeData.user._id === currentUser._id) {
        alert("Its your recipe");
      } else {
        const uid = id as string;
        const docRef = doc(db, "recipes", uid);
        let starsValue = recipeData.stars;
        let numberOfGradesValue = recipeData.numberOfGrades;
        let recipeOpnionGiversValues = recipeData.recipeGradesGivers;
        starsValue = Math.round(
          (starsValue * numberOfGradesValue + value) / (numberOfGradesValue + 1)
        );

        numberOfGradesValue++;
        recipeOpnionGiversValues.push(currentUser._id);
        const updatedData = {
          numberOfGrades: numberOfGradesValue,
          stars: starsValue,
          recipeOpnionGivers: recipeOpnionGiversValues,
        };

        await updateDoc(docRef, updatedData);
        setNumberOfStarsState(numberOfStarsState + 1);
        setStarsState(starsValue);
        alert("You give a Grade successfully");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const stars = Array(5)
    .fill(null)
    .map((_, index) => (
      <img
        onClick={() => {
          handleGiveGrade(index + 1);
        }}
        key={index}
        src={
          index + 1 <= (hoveredStar !== null ? hoveredStar : StarsState)
            ? starWhite
            : starBorderOnly
        }
        className="w-20px h-auto cursor-pointer ml-1px mr-1px"
        alt="star"
        onMouseEnter={() => setHoveredStar(index + 1)}
        onMouseLeave={() => setHoveredStar(null)}
      ></img>
    ));
  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-screen-xl px-4 bg-primaryOpacity text-white mb-37px">
        <div className="grid grid-cols-5 md:grid-cols-5 gap-4 mt-10">
          <div className="col-span-5 md:col-span-2 p-37px relative z-10 ">
            <div className="text-center mb-55px">
              {recipeData.title && (
                <h1 className="mb-22px text-3xl">{recipeData.title}</h1>
              )}

              {recipeData.user.photoUrl && (
                <img
                  src={recipeData.user.photoUrl}
                  className="z-10 relative mx-auto w-250px max-h-250px mb-10px cursor-pointer"
                  alt="profile"
                  onClick={() => {
                    window.location.href = `../profile/${recipeData.user._id}`;
                  }}
                ></img>
              )}
              {recipeData.user.username && recipeData.user.lastName && (
                <p
                  className="text-base cursor-pointer"
                  onClick={() => {
                    window.location.href = `../profile/${recipeData.user._id}`;
                  }}
                >
                  {recipeData.user.username} {recipeData.user.lastName}
                </p>
              )}
              {recipeData.user.username && !recipeData.user.lastName && (
                <p
                  className="text-base cursor-pointer"
                  onClick={() => {
                    window.location.href = `../profile/${recipeData.user._id}`;
                  }}
                >
                  {recipeData.user.username}
                </p>
              )}
              <div className="relative flex flex-row w-full items-center justify-center mt-10px mb-10px">
                <span className="left-[calc(50%-98px)]  absolute">
                  [ {numberOfStarsState} ]
                </span>

                {stars}
              </div>
            </div>

            <div>
              <h1 className="mb-20px text-2xl">Ingredients:</h1>
              <ul className="text-lg list-disc list-inside">
                {recipeData.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-5 md:col-span-3 p-37px relative z-10">
            <img
              src={recipeData.photoUrl}
              className="z-10 relative mx-auto max-w-full mb-29px max-h-400px"
              alt="food"
            ></img>
            <div>
              <h2 className="mb-20px text-2xl">Instructions:</h2>
              <div className="text-lg list-decimal list-inside">
                {recipeData.description.split("\n").map((step, index) => (
                  <span key={index}>{step}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
