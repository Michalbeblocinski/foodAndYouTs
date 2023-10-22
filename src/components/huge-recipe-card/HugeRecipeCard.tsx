import React, {useState} from "react";
import star from "../../utils/star.svg";
import clock from "../../utils/clock.svg";
import { truncateDescription } from "../../utils/truncateDescription";

interface HugeRecipeCardProps {
  mainPhoto: string;
  title: string;
  description: string;
  stars: number;
  cookingTime: number;
  _id: string;
  numberOfOpinions: number;
  difficulty:string
}

export const HugeRecipeCard: React.FC<HugeRecipeCardProps> = ({
  mainPhoto,
  title,
  description,
  stars,
  cookingTime,
  _id,
  difficulty,
  numberOfOpinions,
}) => {
  return (
    <div
      className="lg:col-span-6 cursor-pointer h-350px bg-primaryOpacity p-20px flex flex-row mainMobile:flex-col overflow-hidden relative"
      onClick={() => {
        window.location.href = `../recipe/${_id}`;
      }}
    >
      <div className={"absolute top-0 left-0 bg-dificulty text-white font-semibold h-40px w-156px rounded-xl text-center pt-5px text-xl"}>{difficulty}</div>
      <img
        src={mainPhoto}
        className="w-250px h-max-310px mainMobile:object-contain object-cover mainMobile:w-full mainMobile:mx-auto mainMobile:h-150px"
        alt="food"
      />
      <div className="text-white w-full  pl-37px mainMobile:px-0 pr-13px flex flex-col justify-between mainMobile:h-52%">
        <div>
          <h1 className="text-center text-xl mainMobile:mt-10px">{title}</h1>
          <div className="mt-37px mainMobile:mt-10px">
            <p className="text-lg">{truncateDescription(description, 15)}</p>
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
  );
};
