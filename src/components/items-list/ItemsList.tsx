import React, { useEffect } from "react";
import Delete from "../../utils/delete.svg";
import AddIcon from "../../utils/add.svg";

interface ItemsListProps {
  label: string;
  items: (string | number)[] | never;
  onButtonClick: (item: string, itemWeight: number, itemUnit: string) => void;
  onButtonAddClick: (
    item: string,
    itemWeight: number,
    itemUnit: string,
  ) => void;
  visibleAddButton: boolean;
}

export const ItemsList: React.FC<ItemsListProps> = ({
  label,
  items,
  onButtonClick,
  onButtonAddClick,
  visibleAddButton,
}) => {
  const shouldEnableScroll = items.length > 9;
  const [visibleAdd, SetVisibleAdd] = React.useState<boolean>(visibleAddButton);
  const mappedTable: (string | number | (string | number)[])[] = [];

  if (items.length == 1) {
    mappedTable.push(items[0] as string | number);
  } else if (items.length == 0) {
  } else {
    for (let i = 0; i < items.length; i += 3) {
      const name: string = items[i] as string;
      const quantity: number = items[i + 1] as number;
      const unit: string = items[i + 2] as string;

      mappedTable.push([name, quantity, unit]);
    }
  }

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
          {mappedTable.map(
            (item: (string | number)[] | string | number, index) => (
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
                        onClick={() => {
                          if (Array.isArray(item)) {
                            onButtonClick(
                              item[0] as string,
                              item[1] as number,
                              item[2] as string,
                            );
                          } else {
                            onButtonClick(
                              item as string,
                              item as number,
                              item as string,
                            );
                          }
                        }}
                      />
                    )}{" "}
                  {item !== "You dont have recipes" &&
                    item !== "You dont have ingredients" &&
                    visibleAdd && (
                      <img
                        src={AddIcon}
                        className="mx-auto w-18px h-18px cursor-pointer ml-5px"
                        alt="add"
                        onClick={() =>
                          onButtonAddClick(
                            item as string,
                            item as number,
                            item as string,
                          )
                        }
                      />
                    )}
                </span>

                {item !== "You dont have recipes" &&
                  item !== "You dont have ingredients" && (
                    <span className="w-full flex items-center pb-11px border-b border-white">
                      {" "}
                      {Array.isArray(item) &&
                        item[0] + " " + item[1] + " " + item[2] + " "}
                      {!Array.isArray(item) && item + " "}
                    </span>
                  )}
                {(item === "You dont have recipes" ||
                  item === "You dont have ingredients") && (
                  <span className="w-full flex items-center pb-11px border-b border-white">
                    {" "}
                    {item}
                  </span>
                )}
              </li>
            ),
          )}
        </ol>
      </div>
    </div>
  );
};
