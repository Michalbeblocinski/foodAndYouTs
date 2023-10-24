import React from "react";
import Delete from "../../utils/delete.svg";

interface ItemsListProps {
  label: string;
  items: string[];
  onButtonClick: (item: string) => void;
}

export const ItemsListRecipes: React.FC<ItemsListProps> = ({
  label,
  items,
  onButtonClick,
}) => {
  const shouldEnableScroll = items.length > 3;

  return (
    <div className="lg:col-span-6 bg-primaryOpacity p-20px text-white">
      <div className="mb-30px">
        <h1 className="text-2xl">{label}</h1>
      </div>
      <div
        className={
          shouldEnableScroll
            ? "max-h-230px overflow-y-auto custom-scrollbar"
            : ""
        }
      >
        <ol className={shouldEnableScroll ? "pr-5px" : ""}>
          {items.map((item, index) => (
            <li
              className="relative mb-26px flex items-center justify-between w-full group"
              key={index}
            >
              <span className="absolute right-0 flex items-center group:opacity-100">
                {item !== "You dont have recipes" &&
                  item !== "You dont have ingredients" && (
                    <img
                      src={Delete}
                      className="mx-auto w-16px h-16px cursor-pointer"
                      alt="delete"
                      onClick={() => onButtonClick(item)}
                    />
                  )}
              </span>
              <span className="w-full flex items-center pb-11px border-b border-white">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
