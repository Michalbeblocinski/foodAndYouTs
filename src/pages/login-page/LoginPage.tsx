import React, { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./forms/LoginForm";
import { RegistrationForm } from "./forms/RegistrationForm";
import { Navbar } from "../../components/navigation";
import loginPhoto from "../../utils/loginpng.png";
import loginVector from "../../utils/loginvector.svg";
import { setLogin } from "../../store/authSlice";
import { UserApp } from "../../utils/types/user";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { createUserDocumentFromAuth, db } from "../../firebaseConfig/config";
import { Recipe } from "../../utils/types/recipe";

export const LoginPage: React.FC = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("../");
      } else {
        setAuthing(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const signWithGoogle = async () => {
    setAuthing(false);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (response) => {
        const userDocRef = doc(db, "users", response.user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          let loggedUser: UserApp = {
            _id: response.user.uid,
            username: userData.username,
            email: userData.email,
            lastName: userData.lastName,
            photoUrl: userData.photoUrl,
            ingredients: userData.ingredients,
            wantedIngredients: userData.wantedIngredients,
            recipes: userData.recipes,
            follows: userData.follows,
            role: userData.role,
            recipesDone: userData.recipesDone,
            recipesDoneStars: userData.recipesDoneStars,
          };
          dispatch(setLogin(loggedUser));
        } else {
          let loggedUser: UserApp = {
            _id: `${response.user.uid}`,
            username: `${response.user.displayName}`,
            email: `${response.user.email}`,
            lastName: null,
            photoUrl: null,
            ingredients: null,
            wantedIngredients: null,
            recipes: null,
            follows: [],
            role: "User",
            recipesDone: [],
            recipesDoneStars: [],
          };
          dispatch(setLogin(loggedUser));
          const { username, role, recipesDone, recipesDoneStars } = loggedUser;
          let smallDataUser = {
            uid: `${response.user.uid}`,
            username: `${response.user.displayName}`,
            email: `${response.user.email}`,
            role: "User",
            recipesDone: [],
          };
          await createUserDocumentFromAuth(
            smallDataUser,
            role,
            recipesDone as Recipe[],
            recipesDoneStars as number[],
            { username },
          );
        }
      })
      .catch((error) => {
        setAuthing(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="">
        <img
          src={loginPhoto}
          className="short:top-90px loginNone:hidden max-w-230px h-493px absolute left-[calc(50%-311px)] top-[calc(50%-250px)]"
          alt="fruits"
        ></img>
        <div className="p-40px short:top-90px text-white w-389px loginMobile:w-screen loginMobile:left-0 h-494px bg-primary absolute loginNone:left-[calc(50%-190px)]  left-[calc(50%-82px)] top-[calc(50%-250px)] flex flex-col  items-center">
          {isLogin ? <LoginForm /> : <RegistrationForm />}
          <br />
          <div className="googleButton">
            <button onClick={() => signWithGoogle()} disabled={authing}>
              Sign In With Google
            </button>
          </div>
          <br />
          {isLogin ? (
            <div className="text-center">
              If you dont have <br />
              an account click{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={() => {
                  setIsLogin(false);
                }}
              >
                here
              </span>{" "}
              to register!
            </div>
          ) : (
            <div>
              Go back to login{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={() => {
                  setIsLogin(true);
                }}
              >
                here
              </span>
            </div>
          )}
        </div>
        <img
          src={loginVector}
          className="short:hidden loginMobile:w-screen loginMobile:left-0 loginNone:left-[calc(50%-190px)] loginNone:w-389px absolute left-[calc(50%-88px)] bottom-[calc(50%-244px)]"
          alt="waves"
        ></img>
      </div>
    </>
  );
};
