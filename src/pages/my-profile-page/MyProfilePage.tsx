import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import { GeneralInfoForm } from "./form";
import { ProfilePhotoButton } from "../../components/profile-photo-button";
import profile from "../../utils/profile.png";
import { ButtonCard } from "../../components/button-card";
import { ItemsList } from "../../components/items-list";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserIngredients,
  changeUserWantedIngredients,
  getUser,
} from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";
import { Link } from "react-router-dom";
import { IngredientForm } from "../add-recipe-page/form/IngredientForm";
import starWhite from "../../utils/starWhite.svg";
import starBorderOnly from "../../utils/starBorderOnly.svg";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/config";
import { Recipe } from "../../utils/types/recipe";
import { ItemsListRecipes } from "../../components/items-list-recipes";

export const MyProfilePage: React.FC = () => {
  const currentUser: UserApp | null = useSelector(getUser);
  const [items, setItems] = useState<Array<string | number>>([
    "You dont have ingredients",
  ]);
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const dispatch = useDispatch();
  const [wantedIngredients, setWantedIngredients] = useState<
    Array<string | number>
  >([]);

  const handleDeleteRecipe = async (recipeTitle: string) => {
    const foundRecipe = recipes.find((recipe) => recipe.title === recipeTitle);
    if (foundRecipe) {
      const recipeId: string = foundRecipe?._id;
      try {
        if (currentUser && recipeId) {
          const docRef = doc(db, "recipes", recipeId);
          await deleteDoc(docRef);
          setRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe._id !== recipeId),
          );
        }
      } catch (error) {
        console.error("Error deleting recipe: ", error);
      }
    }
  };
  const handleGenerateShoppingList = () => {};
  const fetchData = async () => {
    try {
      const colRef = collection(db, "recipes");
      const docsSnap = await getDocs(colRef);
      const recipesData: Array<Recipe> = [];
      if (currentUser) {
        docsSnap.forEach((doc) => {
          const recipeData: Recipe = {
            _id: doc.id,
            ...doc.data(),
          } as Recipe;
          if (recipeData.user._id === currentUser._id) {
            recipesData.push(recipeData);
          }
        });
      }

      setRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (
      currentUser &&
      currentUser.ingredients &&
      currentUser.ingredients.length !== 0
    ) {
      setItems(currentUser.ingredients);
    }
    if (
      currentUser &&
      currentUser.wantedIngredients &&
      currentUser.wantedIngredients.length !== 0
    ) {
      setWantedIngredients(currentUser.wantedIngredients);
    }
  }, []);

  const handleAddIngredientToWantedIngredients = (item: string) => {
    let tmpWantedIngredients: (string | number)[] = [...wantedIngredients];
    for (let i = 0; i < items.length; i = i + 2) {
      if (items[i] == item) {
        tmpWantedIngredients.push(items[i]);
        tmpWantedIngredients.push(items[i + 1]);
      }
    }
    setWantedIngredients(tmpWantedIngredients);
  };
  useEffect(() => {
    if (currentUser) {
      dispatch(changeUserWantedIngredients(wantedIngredients));
    }
  }, [wantedIngredients]);

  const handleDeleteOneWantedInggredient = (item: string) => {
    let tmpWantedIngredientsDelete = [];
    for (let i = 0; i < wantedIngredients.length; i = i + 2) {
      if (wantedIngredients[i] !== item) {
        tmpWantedIngredientsDelete.push(wantedIngredients[i]);
        tmpWantedIngredientsDelete.push(wantedIngredients[i + 1]);
      }
    }
    if (tmpWantedIngredientsDelete.length === 0) {
      setWantedIngredients([]);
    } else {
      setWantedIngredients(tmpWantedIngredientsDelete);
    }
  };
  const handleDeleteOneInggredient = async (item: string) => {
    let tmpIngredientsArrayWithoutTwo = [];
    for (let i = 0; i < items.length; i = i + 2) {
      if (items[i] !== item) {
        tmpIngredientsArrayWithoutTwo.push(items[i]);
        tmpIngredientsArrayWithoutTwo.push(items[i + 1]);
      }
    }
    if (tmpIngredientsArrayWithoutTwo.length === 0) {
      setItems(["You dont have ingredients"]);
    } else {
      setItems(tmpIngredientsArrayWithoutTwo);
    }
    try {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser._id);
        const updatedData = {
          ingredients: tmpIngredientsArrayWithoutTwo,
        };
        await updateDoc(docRef, updatedData);
        dispatch(changeUserIngredients(updatedData));
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleAddIngredient = async (
    newItem: string,
    newItemWeight: number,
  ) => {
    let tmpIngredientsArray: (string | number)[] = [...items];
    tmpIngredientsArray.push(newItem);
    tmpIngredientsArray.push(parseInt(String(newItemWeight)));

    let tmp2IngredientsArray: (string | number)[] = tmpIngredientsArray.filter(
      (element) => element !== "You dont have ingredients",
    );

    try {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser._id);
        const updatedData = {
          ingredients: tmp2IngredientsArray,
        };
        await dispatch(changeUserIngredients(updatedData));
        await updateDoc(docRef, updatedData);
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }

    setItems(tmp2IngredientsArray);
  };

  const handleDeleteAllInggredients = async () => {
    try {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser._id);

        const updatedData = {
          ingredients: [],
        };
        await updateDoc(docRef, updatedData);
        dispatch(changeUserIngredients(updatedData));
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }

    setItems(["You dont have ingredients"]);
  };

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto px-4 relative z-10 my-37px"
        style={{ maxWidth: "1060px" }}
      >
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          {currentUser !== null && (
            <GeneralInfoForm currentUser={currentUser} />
          )}
          {currentUser !== null && currentUser.photoUrl ? (
            <ProfilePhotoButton
              imageUrl={currentUser.photoUrl}
              buttonLabel="Change Photo"
              currentUser={currentUser}
            />
          ) : (
            <ProfilePhotoButton
              imageUrl={profile}
              buttonLabel="Change Photo"
              currentUser={currentUser}
            />
          )}
        </div>
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          {recipes !== null ? (
            <ItemsListRecipes
              label="Your Recipes"
              items={recipes.map((recipe) => recipe.title)}
              onButtonClick={(recipeTitle) => handleDeleteRecipe(recipeTitle)}
            />
          ) : (
            <ItemsListRecipes
              label="Your Recipes"
              onButtonClick={() => {}}
              items={["You dont have recipes"]}
            />
          )}

          <div className="lg:col-span-4 h-350px">
            <Link to={`/shoppinglist`}>
              <ButtonCard
                buttonLabel="Generate a Shopping List"
                onButtonClick={handleGenerateShoppingList}
              />
            </Link>
            <Link to={`/addrecipe`}>
              <ButtonCard buttonLabel="Add Recipe" onButtonClick={() => {}} />{" "}
            </Link>
          </div>
        </div>
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          <ItemsList
            label="Your Ingredients"
            items={items}
            onButtonClick={handleDeleteOneInggredient}
            onButtonAddClick={handleAddIngredientToWantedIngredients}
            visibleAddButton={true}
          />
          <div className="lg:col-span-4 h-350px">
            <IngredientForm onIngredientChange={handleAddIngredient} />
            <ButtonCard
              buttonLabel="Delete All"
              onButtonClick={handleDeleteAllInggredients}
            />
          </div>
        </div>
        <div className="grid gap-24px lg:grid-cols-6 mb-24px">
          {" "}
          <ItemsList
            label="Your Wanted Ingredients"
            items={wantedIngredients}
            onButtonClick={handleDeleteOneWantedInggredient}
            onButtonAddClick={handleDeleteOneWantedInggredient}
            visibleAddButton={false}
          />
        </div>
        <div
          className={
            "grid lg:grid-cols-1 mb-24px mt-24px bg-primaryOpacity p-20px text-white"
          }
        >
          <div className="mb-30px">
            <h1 className="text-2xl">Your History</h1>
            <ol>
              {currentUser &&
                currentUser.recipesDone &&
                currentUser.recipesDoneStars &&
                currentUser.recipesDone.map((item, index) => (
                  <li
                    key={index}
                    className="relative mb-13px mt-13px flex items-center justify-between w-full pb-10px group border-b-1"
                  >
                    {item.title}
                    <div className="flex flex-row">
                      {Array(5)
                        .fill("a")
                        .map((_, starIndex) => {
                          if (
                            currentUser.recipesDoneStars !== null &&
                            starIndex < currentUser.recipesDoneStars[index]
                          ) {
                            return (
                              <img
                                key={starIndex}
                                onClick={() => {}}
                                src={starWhite}
                                className="w-20px h-auto  ml-1px mr-1px"
                                alt="star"
                              />
                            );
                          } else {
                            return (
                              <img
                                key={starIndex}
                                onClick={() => {}}
                                src={starBorderOnly}
                                className="w-20px h-auto ml-1px mr-1px"
                                alt="starBorderOnly"
                              />
                            );
                          }
                        })}
                    </div>
                  </li>
                ))}
              {currentUser?.recipesDone?.length === 0 && (
                <li className={"mt-10px"}>History is empty</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};
