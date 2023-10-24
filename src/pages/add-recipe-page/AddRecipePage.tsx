import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import { ButtonCard } from "../../components/button-card";
import { ItemsList } from "../../components/items-list";
import { ProfilePhotoButton } from "../../components/profile-photo-button";
import main from "../../utils/mainphoto.png";
import { CategoryForm, InfoForm, TitleForm } from "./form";
import { IngredientForm } from "./form/IngredientForm";
import { db } from "../../firebaseConfig/config";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";

export const AddRecipePage: React.FC = () => {
  const [titleRecipe, setTitleRecipe] = useState<string>("");
  const [dificultyState, setDificultyState] = useState<string>("Easy");
  const [categoryState, setCategoryState] = useState<string>("Lunch");
  const [timeRecipe, setTimeRecipe] = useState<number>(0);
  const [descriptionRecipe, setDescriptionRecipe] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>(main);
  const [items, setItems] = useState<Array<string | number>>([
    "You dont have ingredients",
  ]);
  const navigate = useNavigate();
  const handleAddIngredient = (newItem: string, newItemWeight: number) => {
    let tmpIngredientsArray: (string | number)[] = items;
    tmpIngredientsArray.push(newItem);
    tmpIngredientsArray.push(parseInt(String(newItemWeight)));
    let tmp2IngredientsArray = tmpIngredientsArray.filter(
      (element) => element !== "You dont have ingredients",
    );
    setItems(tmp2IngredientsArray);
  };
  const user = useSelector(getUser);
  const handleDeleteAllInggredients = () => {
    setItems(["You dont have ingredients"]);
  };

  const normalizeUserData = (user: UserApp) => {
    const normalizedUser: UserApp = {
      email: user.email || "",
      follows: user.follows || null,
      _id: user._id || "",
      username: user.username,
      lastName: user.lastName || null,
      photoUrl: user.photoUrl || null,
      ingredients: user.ingredients || [],
      wantedIngredients: user.wantedIngredients || [],
      recipes: user.recipes || [],
      role: user.role || "",
      recipesDone: user.recipesDone || null,
      recipesDoneStars: user.recipesDoneStars || null,
    };

    return normalizedUser;
  };

  const handleAddRecipe = async () => {
    if (user) {
      let sendUser = normalizeUserData(user);
      if (!titleRecipe || !descriptionRecipe || items.length === 0) {
        alert("all data is required");
        return;
      }

      const recipe = {
        title: titleRecipe,
        time: timeRecipe,
        description: descriptionRecipe,
        ingredients: items,
        photoUrl: photoUrl,
        user: sendUser,
        stars: 5,
        numberOfGrades: 0,
        recipeGradesGivers: [],
        difficulty: dificultyState,
        category: categoryState,
      };
      try {
        const docRef = await addDoc(collection(db, "recipes"), recipe);
        alert("Recipe was added with id: " + docRef.id);
        setDificultyState("Easy");
        setCategoryState("Lunch");
        setTitleRecipe("");
        setTimeRecipe(0);
        setDescriptionRecipe("");
        setItems(["You dont have ingredients"]);
        setPhotoUrl(main);
        navigate("../my-profile");
      } catch (error) {
        console.error("error:", error);
        alert("Error during sending to database");
      }
    }
  };
  const handleDeleteOneInggredient = (item: string) => {
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
  };
  const handleTitleChange = (titleValue: string, timeValue: number) => {
    setTitleRecipe(titleValue);
    setTimeRecipe(timeValue);
  };
  const handleCategoryChange = (
    dificultyValue: string,
    categoryValue: string,
  ) => {
    setCategoryState(categoryValue);
    setDificultyState(dificultyValue);
  };
  const handleDescriptionChange = (descriptionValue: string) => {
    setDescriptionRecipe(descriptionValue);
  };
  const handlePhotoUrlChange = (urlValue: string) => {
    setPhotoUrl(urlValue);
  };

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto px-4 relative z-10 my-37px"
        style={{ maxWidth: "1060px" }}
      >
        <div className="grid gap-24px lg:grid-cols-1 mb-24px">
          <div className="lg:col-span-1 h-156px bg-primaryOpacity p-20px relative text-white">
            <div className="mb-10px">
              <h1 className="text-2xl">Title</h1>
            </div>
            <TitleForm onTitleChange={handleTitleChange} />
          </div>
        </div>{" "}
        <div className="grid gap-24px lg:grid-cols-1 mb-24px">
          <div className="lg:col-span-1 h-156px bg-primaryOpacity p-20px relative text-white">
            <div className="mb-10px">
              <h1 className="text-2xl">Informations</h1>
            </div>
            <CategoryForm onTitleChange={handleCategoryChange} />
          </div>
        </div>
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          <ItemsList
            label="Your Ingredients"
            items={items}
            onButtonClick={handleDeleteOneInggredient}
            onButtonAddClick={handleDeleteOneInggredient}
            visibleAddButton={false}
          />
          <div className="lg:col-span-4 h-350px">
            <IngredientForm onIngredientChange={handleAddIngredient} />
            <ButtonCard
              buttonLabel="Delete All"
              onButtonClick={handleDeleteAllInggredients}
            />
          </div>
        </div>
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          <div className="lg:col-span-6 h-350px bg-primaryOpacity p-20px relative">
            <InfoForm
              onDescriptionChange={handleDescriptionChange}
              initialDescription={descriptionRecipe}
            />
          </div>
          <ProfilePhotoButton
            imageUrl={photoUrl}
            buttonLabel="Change Photo"
            recipeId="true"
            onPhotoRecipeChange={handlePhotoUrlChange}
          />
        </div>
        <div className="lg:col-span-1 h-350px">
          <ButtonCard
            buttonLabel="Add recipe"
            onButtonClick={handleAddRecipe}
          />
        </div>
      </div>
    </>
  );
};
