import React from "react";
import { Navbar } from "../../components/navigation";
import mainPhoto from "../../utils/mainphoto.png";

export const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="text-white bg-primary">
        <img
          src={mainPhoto}
          className="z-10 relative mx-auto w-full"
          alt="pizza"
        ></img>
        <div className="w-full min-h-202 quote:min-h-310 bg-primary z-10 fixed bottom-0 h-[calc(100vh-41vw-70px)]">
          <div
            className="relative w-full mt-60px before:absolute before:left-[calc(50%-161px)] before:top-!15px before:bg-white  before:w-322px before:h-2px
          after:absolute after:left-[calc(50%-161px)] after:bottom-!15px after:bg-white  after:w-322px after:h-2px"
          >
            <h1 className="text-4xl text-center">FOOD & YOU</h1>
            <div className="relative">
              <p className="text-lg text-center mt-15px">
                <span className="before:absolute before:w-5px before:h-5px before:bg-white before:rounded-full before:left-[calc(50%-107px)] before:bottom-11px"></span>
                Recipes for everyone
                <span className="before:absolute before:w-5px before:h-5px before:bg-white before:rounded-full before:right-[calc(50%-107px)] before:bottom-11px"></span>
              </p>
            </div>
          </div>

          <div className="w-full h-110px p-20px text-center mt-22% quoteNone:hidden">
            <p className="font-quote text-4xl">Cooking: A delicious journey </p>
            <p className="font-quote text-4xl">~ Anthony Bourdain</p>
          </div>
        </div>
      </div>
    </>
  );
};
