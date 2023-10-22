import { Recipe } from "./recipe";

export type UserApp = {
  _id: string;
  username: string;
  lastName: string | null;
  email: string;
  photoUrl: string | null;
  ingredients: Array<string> | null;
  recipes: Array<Recipe> | null;
  follows: Array<string> | null;
  role: string;
};
