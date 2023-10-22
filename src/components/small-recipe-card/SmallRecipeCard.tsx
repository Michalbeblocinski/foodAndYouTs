import React, {FC, useState} from "react";
import star from "../../utils/star.svg";
import clock from "../../utils/clock.svg";
import { truncateDescription } from "../../utils/truncateDescription";
import { Link } from "react-router-dom";

interface SmallRecipeCardProps {
  mainPhoto: string;
  title: string;
  description: string;
  stars: number;
  cookingTime: number;
  _id: string;
  numberOfOpinions: number;
  difficulty:string
}

export const SmallRecipeCard: FC<SmallRecipeCardProps> = ({
  mainPhoto,
  title,
  description,
  stars,
  cookingTime,
  _id,
    difficulty,
  numberOfOpinions
}) => {

  return (
    <Link to={`../recipe/${_id}`}>
      <div className="lg:col-span-1 h-350px bg-primaryOpacity p-20px flex flex-col relative">
        <div className={"absolute top-0 right-0 bg-dificulty text-white font-semibold h-30px w-115px rounded-xl text-center pt-3px"}>{difficulty}</div>
        <img
          src={mainPhoto}
          className="w-286px h-150px mainMobile:object-contain object-cover mainMobile:w-full mainMobile:mx-auto"
          alt="food"
        />
        <div className="text-white flex flex-col justify-between h-52%">
          <div>
            <h1 className="text-center text-xl mt-10px">{title}</h1>
            <div className="mt-10px">
              <p className="text-lg">{truncateDescription(description, 10)}</p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              {[...Array(stars)].map((_, index) => (
                <img
                  key={index}
                  src={star}
                  className="w-20px h-20px"
                  alt="star"
                />
              ))}
            </div>
            <div className="flex flex-row">
              <img src={clock} className="w-20px h-20px" alt="clock" />
              <div className="ml-8px relative bottom-2px">{cookingTime}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
