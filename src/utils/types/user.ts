import { Recipe } from "./recipe";

export type UserApp = {
  _id: string;
  username: string;
  lastName: string | null;
  email: string;
  photoUrl: string | null;
  ingredients: Array<string | number> | null;
  wantedIngredients: Array<string | number> | null;
  recipes: Array<Recipe> | null;
  follows: Array<string> | null;
  role: string;
  recipesDone: Array<Recipe> | null;
  recipesDoneStars: Array<number> | null;
};
