import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/navigation";
import mainPhoto from "../../utils/mainphoto.png";
import { HugeRecipeCard } from "../../components/huge-recipe-card";
import { MediumRecipeCard } from "../../components/medium-recipe-card";
import { SmallRecipeCard } from "../../components/small-recipe-card";
import { Recipe } from "../../utils/types/recipe";
import { collection, getDocs } from "firebase/firestore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "../../firebaseConfig/config";
import { useSelector } from "react-redux";
import { getUser } from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";

export const BreakfastPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Array<Recipe>>([]);
  const [hugeRecipe, setHugeRecipe] = useState<Recipe | null>();
  const [mediumRecipes, setMediumRecipes] = useState<Recipe | null>();
  const [smallRecipes, setSmallRecipes] = useState<Array<Recipe>>([]);
  const [showButtons, setShowButtons] = useState<boolean>(true);
  const currentUser: UserApp = useSelector(getUser) as UserApp;
  useEffect(() => {
    if (smallRecipes.length < 7) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  }, [smallRecipes]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  const nextPage = () => {
    if (currentPage < Math.ceil(smallRecipes.length / recipesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const fetchData = async () => {
    try {
      const colRef = collection(db, "recipes");
      const docsSnap = await getDocs(colRef);
      const recipesData: Array<Recipe> = [];
      docsSnap.forEach((doc) => {
        const recipeData: Recipe = {
          _id: doc.id,
          ...doc.data(),
        } as Recipe;

        if (recipeData.category === "Breakfast") {
          recipesData.push(recipeData);
        }
      });

      setRecipes(recipesData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      setHugeRecipe(recipes[0]);
    }
    if (recipes.length > 1) {
      setMediumRecipes(recipes[1]);
    }
    if (recipes.length > 2) {
      setSmallRecipes(recipes.slice(2));
    }
  }, [recipes]);
  return (
    <>
      <Navbar />
      <div className="text-white ">
        <div
          className="relative w-full my-40px before:absolute before:left-[calc(50%-161px)] before:top-!15px before:bg-white  before:w-322px before:h-2px
          after:absolute after:left-[calc(50%-161px)] after:bottom-!15px after:bg-white  after:w-322px after:h-2px"
        >
          <h1 className="text-3xl text-center">Breakfast recipes:</h1>
        </div>
        <img
          src={mainPhoto}
          className="z-10 relative mx-auto w-full h-130px object-none"
          alt="pizza"
        ></img>
      </div>
      <div
        className="container mx-auto px-4 relative z-10 my-37px"
        style={{ maxWidth: "1060px" }}
      >
        <div className="grid gap-24px lg:grid-cols-10 mb-24px">
          {hugeRecipe && (
            <HugeRecipeCard
              mainPhoto={hugeRecipe.photoUrl}
              title={hugeRecipe.title}
              description={hugeRecipe.description}
              stars={hugeRecipe.stars}
              cookingTime={hugeRecipe.time}
              _id={hugeRecipe._id}
              numberOfOpinions={hugeRecipe.numberOfGrades}
              difficulty={hugeRecipe.difficulty}
            />
          )}
          {!hugeRecipe && (
            <div
              className={"text-white absolute text-3xl left-[calc(50%-114px)]"}
            >
              No recipe found
            </div>
          )}

          {mediumRecipes && (
            <MediumRecipeCard
              mainPhoto={mediumRecipes.photoUrl}
              title={mediumRecipes.title}
              description={mediumRecipes.description}
              stars={mediumRecipes.stars}
              cookingTime={mediumRecipes.time}
              _id={mediumRecipes._id}
              numberOfOpinions={mediumRecipes.numberOfGrades}
              difficulty={mediumRecipes.difficulty}
            />
          )}
        </div>
        <div className="grid gap-24px lg:grid-cols-3 mb-24px">
          {smallRecipes
            .slice(
              (currentPage - 1) * recipesPerPage,
              currentPage * recipesPerPage,
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
