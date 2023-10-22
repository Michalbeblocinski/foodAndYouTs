import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SearchForm } from "./form";
import { SmallRecipeCard } from "../../components/small-recipe-card";
import { Recipe } from "../../utils/types/recipe";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/config";

export const SearchPage: React.FC = () => {
  const [smallRecipes, setSmallRecipes] = useState<Array<Recipe>>([]);
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recipesPerPage = 6;
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

  const getRecipesData = async (value: string) => {
    try {
      const colRef = collection(db, "recipes");
      const docsSnap = await getDocs(colRef);
      const recipesData: Array<Recipe> = [];
      docsSnap.forEach((doc) => {
        const recipeData: Recipe = {
          _id: doc.id,
          ...doc.data(),
        } as Recipe;

        if (
          recipeData.title.toLowerCase().includes(value.toLowerCase()) ||
          recipeData.description.toLowerCase().includes(value.toLowerCase())
        ) {
          recipesData.push(recipeData);
        }
      });
      if (recipesData.length > 0) {
        setSmallRecipes(recipesData);
      } else {
        setSmallRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
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
              <h1 className="text-2xl">Search Recipe</h1>
            </div>
            <SearchForm getRecipesData={getRecipesData} />
          </div>
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
