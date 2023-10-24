import React from "react";
import "./App.css";
import { LoginPage, HomePage, ShoppinglistPage } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import Dots from "./utils/dots.svg";
import { RecipePage } from "./pages";
import { MainPage } from "./pages/main-page";
import { MyProfilePage } from "./pages/my-profile-page";
import { SearchPage } from "./pages/search-page";
import { ProfilePage } from "./pages/profile-page";
import { AddRecipePage } from "./pages/add-recipe-page";
import { FollowingUsersRecipesPage } from "./pages/following-users-recipes-page";
import { RecipesWithYourIngredientsPage } from "./pages/recipes-with-your-ingredients-page";
import { AdminPage } from "./pages/admin-page";
import { BreakfastPage } from "./pages/categories/breakfastPage";
import { LunchPage, SupperPage } from "./pages/categories";
import { RecipesWithWantedIngredientsPage } from "./pages/recipes-with-wanted-ingredients-page";

const App: React.FC = () => {
  return (
    <div className="App bg-background min-h-screen font-primary">
      <img
        src={Dots}
        alt="dots"
        className="fixed bottom-23px left-[calc(50%-852px)] z-0"
      ></img>
      <img
        src={Dots}
        alt="dots"
        className="fixed top-146px right-[calc(50%-722px)] z-0"
      ></img>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <HomePage />
              </AuthRoute>
            }
          />
          <Route
            path="/recipe/:id"
            element={
              <AuthRoute>
                <RecipePage />
              </AuthRoute>
            }
          />
          <Route
            path="/shoppinglist"
            element={
              <AuthRoute>
                <ShoppinglistPage />
              </AuthRoute>
            }
          />{" "}
          <Route
            path="/admin"
            element={
              <AuthRoute>
                <AdminPage />
              </AuthRoute>
            }
          />
          <Route
            path="/recipes-of-the-day"
            element={
              <AuthRoute>
                <MainPage />
              </AuthRoute>
            }
          />
          <Route
            path="/breakfast"
            element={
              <AuthRoute>
                <BreakfastPage />
              </AuthRoute>
            }
          />
          <Route
            path="/supper"
            element={
              <AuthRoute>
                <SupperPage />
              </AuthRoute>
            }
          />
          <Route
            path="/lunch"
            element={
              <AuthRoute>
                <LunchPage />
              </AuthRoute>
            }
          />
          <Route
            path="/following-users-recipes"
            element={
              <AuthRoute>
                <FollowingUsersRecipesPage />
              </AuthRoute>
            }
          />
          <Route
            path="/recipes-with-your-ingredients"
            element={
              <AuthRoute>
                <RecipesWithYourIngredientsPage />
              </AuthRoute>
            }
          />{" "}
          <Route
            path="/recipes-with-wanted-ingredients"
            element={
              <AuthRoute>
                <RecipesWithWantedIngredientsPage />
              </AuthRoute>
            }
          />
          <Route
            path="/search"
            element={
              <AuthRoute>
                <SearchPage />
              </AuthRoute>
            }
          />
          <Route
            path="/addrecipe"
            element={
              <AuthRoute>
                <AddRecipePage />
              </AuthRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <AuthRoute>
                <MyProfilePage />
              </AuthRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <AuthRoute>
                <ProfilePage />
              </AuthRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
