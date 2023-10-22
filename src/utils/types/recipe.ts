import { UserApp } from "./user";

export type Recipe = {
  _id: string;
  title: string;
  user: UserApp;
  description: string;
  ingredients: Array<string>;
  photoUrl: string;
  time: number;
  stars: number;
  numberOfGrades: number;
  recipeGradesGivers: Array<string>;
  difficulty: string;
  category:  string;
};
