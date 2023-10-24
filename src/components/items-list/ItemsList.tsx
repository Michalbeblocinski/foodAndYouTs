import React, { useEffect } from "react";
import Delete from "../../utils/delete.svg";
import AddIcon from "../../utils/add.svg";

interface ItemsListProps {
  label: string;
  items: (string | number)[] | never;
  onButtonClick: (item: string, itemWeight: number) => void;
  onButtonAddClick: (item: string, itemWeight: number) => void;
  visibleAddButton: boolean;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  label,
  items,
  onButtonClick,
  onButtonAddClick,
  visibleAddButton,
}) => {
  const shouldEnableScroll = items.length > 6;
  const [visibleAdd, SetVisibleAdd] = React.useState<boolean>(visibleAddButton);
  const mappedTable: (string | number)[][] | never = items.reduce(
    (acc: (string | number)[][], item, index) => {
      if (items.length <= 1) {
        acc.push([items[0]]);
        return acc;
      } else {
        if (index % 2 === 0) {
          acc.push([item, items[index + 1]]);
        }
        return acc;
      }
    },
    [],
  );

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
          {mappedTable.map((item, index) => (
            <li
              className="relative mb-26px flex items-center justify-between w-full group"
              key={index}
            >
              <span className="absolute right-0 flex items-center group:opacity-100">
                {item[0] !== "You dont have recipes" &&
                  item[0] !== "You dont have ingredients" && (
                    <img
                      src={Delete}
                      className="mx-auto w-16px h-16px cursor-pointer"
                      alt="delete"
                      onClick={() =>
                        onButtonClick(item[0] as string, item[1] as number)
                      }
                    />
                  )}{" "}
                {item[0] !== "You dont have recipes" &&
                  item[0] !== "You dont have ingredients" &&
                  visibleAdd && (
                    <img
                      src={AddIcon}
                      className="mx-auto w-18px h-18px cursor-pointer ml-5px"
                      alt="add"
                      onClick={() =>
                        onButtonAddClick(item[0] as string, item[1] as number)
                      }
                    />
                  )}
              </span>

              {item[0] !== "You dont have recipes" &&
                item[0] !== "You dont have ingredients" && (
                  <span className="w-full flex items-center pb-11px border-b border-white">
                    {" "}
                    {item[0] + " " + item[1] + " grams/pieces/ml"}{" "}
                  </span>
                )}
              {(item[0] == "You dont have recipes" ||
                item[0] == "You dont have ingredients") && (
                <span className="w-full flex items-center pb-11px border-b border-white">
                  {" "}
                  {item[0]}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
