import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import { GeneralInfoForm } from "./form";
import { ProfilePhotoButton } from "../../components/profile-photo-button";
import profile from "../../utils/profile.png";
import { ButtonCard } from "../../components/button-card";
import { ItemsList } from "../../components/items-list";
import { useDispatch, useSelector } from "react-redux";
import { changeUserIngredients, getUser } from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";
import { Link } from "react-router-dom";
import { IngredientForm } from "../add-recipe-page/form/IngredientForm";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/config";
import { Recipe } from "../../utils/types/recipe";

export const MyProfilePage: React.FC = () => {
  const currentUser: UserApp | null = useSelector(getUser);
  const [items, setItems] = useState<Array<string>>([
    "You dont have ingredients",
  ]);
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const dispatch = useDispatch();

  const handleDeleteRecipe = async (recipeTitle: string) => {
    const foundRecipe = recipes.find((recipe) => recipe.title === recipeTitle);
    if (foundRecipe) {
      const recipeId: string = foundRecipe?._id;
      try {
        if (currentUser && recipeId) {
          const docRef = doc(db, "recipes", recipeId);
          await deleteDoc(docRef);
          setRecipes((prevRecipes) =>
            prevRecipes.filter((recipe) => recipe._id !== recipeId)
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
  }, []);

  const handleDeleteOneInggredient = async (item: string) => {
    let tmpIngredientsArrayWithoutOne = items.filter(
      (element) => element !== item
    );
    if (tmpIngredientsArrayWithoutOne.length === 0) {
      setItems(["You dont have ingredients"]);
    } else {
      setItems(tmpIngredientsArrayWithoutOne);
    }
    try {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser._id);
        const updatedData = {
          ingredients: tmpIngredientsArrayWithoutOne,
        };
        await updateDoc(docRef, updatedData);
        dispatch(changeUserIngredients(updatedData));
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleAddIngredient = async (newItem: string) => {
    let tmpIngredientsArray = [...items, newItem];
    let tmp2IngredientsArray = tmpIngredientsArray.filter(
      (element) => element !== "You dont have ingredients"
    );
    try {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser._id);
        const updatedData = {
          ingredients: tmp2IngredientsArray,
        };
        await updateDoc(docRef, updatedData);
        dispatch(changeUserIngredients(updatedData));
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
            <ItemsList
              label="Your Recipes"
              items={recipes.map((recipe) => recipe.title)}
              onButtonClick={(recipeTitle) => handleDeleteRecipe(recipeTitle)}
            />
          ) : (
            <ItemsList
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
          />
          <div className="lg:col-span-4 h-350px">
            <IngredientForm onIngredientChange={handleAddIngredient} />
            <ButtonCard
              buttonLabel="Delete All"
              onButtonClick={handleDeleteAllInggredients}
            />
          </div>
        </div>
      </div>
    </>
  );
};
