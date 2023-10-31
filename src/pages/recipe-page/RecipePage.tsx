import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/config";
import { Recipe } from "../../utils/types/recipe";
import starWhite from "../../utils/starWhite.svg";
import starBorderOnly from "../../utils/starBorderOnly.svg";
import { useSelector } from "react-redux";
import {
  changeUserIngredients,
  changeUserRecipesDone,
  changeUserRecipesDoneStars,
  changeUserWantedIngredients,
  getUser,
  setLogin,
} from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";
import { CustomButton } from "../../components/custome-button";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DisabledCustomButton } from "../../components/disabled-custom-button";

export const RecipePage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState<Recipe | undefined>(undefined);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [numberOfStarsState, setNumberOfStarsState] = useState<number>(5);
  const [StarsState, setStarsState] = useState<number>(5);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

  const currentUser: UserApp = useSelector(getUser) as UserApp;
  const [userIngredients, setUserIngredients] = useState<any[]>(
    currentUser.ingredients || [],
  );
  const [userWantedIngredients, setUserWantedIngredients] = useState<any[]>(
    currentUser.wantedIngredients || [],
  );
  const initialValues = {
    rating: 5,
  };

  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5")
      .required("Rating is required"),
  });

  const handleIDidRecipe = async (values: { rating: number }) => {
    setButtonClicked(true);
    if (recipeData) {
      const requiredIngredients: Array<string> = recipeData.ingredients;

      const updatedUserIngredients = [...userIngredients];
      const updatedUserWantedIngredients = [...userWantedIngredients];

      const hasEnoughIngredients: boolean = requiredIngredients.every(
        (ingredient: string, index: number) => {
          if (index % 3 === 0) {
            const ingredientName: string = ingredient;
            const userIngredients: any[] = updatedUserIngredients;
            const wantedIngredients: any[] = updatedUserWantedIngredients;

            const userIngredientIndex: number =
              userIngredients.indexOf(ingredientName);
            const userWantedIngredientIndex: number =
              wantedIngredients.indexOf(ingredientName);

            if (userIngredientIndex !== -1) {
              const ingredientAmount: string = requiredIngredients[index + 1];
              if (
                userIngredients[userIngredientIndex + 1] >= ingredientAmount
              ) {
                const amountToSubtract = parseInt(ingredientAmount);

                updatedUserIngredients[userIngredientIndex + 1] -=
                  amountToSubtract;
                if (userWantedIngredientIndex !== -1) {
                  updatedUserWantedIngredients[userWantedIngredientIndex + 1] -=
                    amountToSubtract;

                  if (wantedIngredients[userWantedIngredientIndex + 1] <= 0) {
                    updatedUserWantedIngredients.splice(
                      userWantedIngredientIndex,
                      3,
                    );
                  }
                }

                if (userIngredients[userIngredientIndex + 1] <= 0) {
                  updatedUserIngredients.splice(userIngredientIndex, 3);
                }
              } else {
                return false;
              }
            } else {
              return false;
            }
          }
          return true;
        },
      );

      if (hasEnoughIngredients) {
        dispatch(
          changeUserIngredients({ ingredients: updatedUserIngredients }),
        );
        dispatch(changeUserWantedIngredients(updatedUserWantedIngredients));

        setStarsState(values.rating);
        try {
          const uid: string = id as string;
          const userDocRef = doc(db, "users", currentUser._id);

          if (
            currentUser.recipesDone &&
            currentUser.recipesDone.filter(
              (recipe: Recipe): boolean => recipe._id === uid,
            ).length > 0
          ) {
            alert("Recipe has already done.");
            return;
          } else {
            if (currentUser.recipesDone && currentUser.recipesDoneStars) {
              const newRecipesDone: (Recipe | Recipe)[] = [
                ...currentUser.recipesDone,
                recipeData,
              ];
              const newRecipesDoneStars: number[] = [
                ...currentUser.recipesDoneStars,
                values.rating,
              ];

              dispatch(changeUserRecipesDone(recipeData));

              dispatch(changeUserRecipesDoneStars(values.rating));

              await updateDoc(userDocRef, {
                recipesDone: newRecipesDone,
                recipesDoneStars: newRecipesDoneStars,
                ingredients: updatedUserIngredients,
              });
              alert("Recipe added.");
            } else {
              alert("You dont have array");
            }
          }
        } catch (error) {
          console.error("Error", error);
        }
      } else {
        alert(
          "You dont have enough ingredients to do this recipe. Please add more ingredients.",
        );
      }
    } else {
      alert("Recipe doesn't have ingredients");
    }
  };

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
          (starsValue * numberOfGradesValue + value) /
            (numberOfGradesValue + 1),
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
  const mappedTable: (string | number)[][] | never =
    recipeData.ingredients.reduce((acc: (string | number)[][], item, index) => {
      if (recipeData.ingredients.length <= 1) {
        acc.push([recipeData.ingredients[0]]);
        return acc;
      } else {
        if (index % 3 === 0) {
          acc.push([
            item,
            recipeData.ingredients[index + 1],
            recipeData.ingredients[index + 2],
          ]);
        }
        return acc;
      }
    }, []);
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
              <h1 className="text-2xl mb-15px">Ingredients:</h1>
              <ul className="text-lg list-disc list-inside">
                {mappedTable.map((item, index) => (
                  <li key={index}>
                    {" "}
                    {item[0] + " " + item[1] + " " + item[2]}{" "}
                  </li>
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
              <div className={"mt-40px"}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleIDidRecipe}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="mt-10px">
                        <label htmlFor="rating" className="text-xl">
                          Rate this recipe only for your history (1-5):
                        </label>
                        <Field
                          type="number"
                          id="rating"
                          name="rating"
                          className="w-20 h-10 px-2 border text-black ml-10px mb-10px outline-none focus:outline-none"
                        />
                        <ErrorMessage
                          name="rating"
                          component="div"
                          className="text-red-500 "
                        />
                      </div>
                      {!buttonClicked && (
                        <CustomButton buttonLabel={"I did it"} />
                      )}
                      {buttonClicked && (
                        <DisabledCustomButton buttonLabel={"I did it"} />
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
