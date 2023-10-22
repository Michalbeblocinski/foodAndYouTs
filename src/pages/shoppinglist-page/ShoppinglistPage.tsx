import React, { useState } from "react";
import html2pdf from "html2pdf.js";
import Button from "@mui/material/Button";
import { Navbar } from "../../components/navigation";

interface Item {
  id: number;
  name: string;
}

export const ShoppinglistPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState<string>("");

  const addItem = (name: string) => {
    setItems((prevItems) => [...prevItems, { id: Date.now(), name }]);
    setNewItemName("");
  };

  const generatePDF = async () => {
    const content = document.getElementById("pdf-content");

    if (content) {
      const originalHeight = content.style.height;
      content.style.height = "auto";
      await new Promise((resolve) => setTimeout(resolve, 500));

      html2pdf().from(content).save("shopping-list.pdf");

      content.style.height = originalHeight;
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-40px short:top-90px  text-white w-389px loginMobile:w-screen loginMobile:left-0  bg-primary absolute left-[calc(50%-190px)]  top-[calc(50%-250px)] flex flex-col items-center">
        <h2 className="text-white text-2xl mb-4">Shopping List</h2>
        <div className="bg-white w-309px">
          <ul
            id="pdf-content"
            className=" text-black p-4 rounded-md  w-309px "
            style={{ height: "auto" }}
          >
            {items.map((item) => (
              <li key={item.id} className="mb-2">
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 w-full">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="px-2 py-1 border border-gray-300 focus:outline-none text-black w-full"
            placeholder="write here a item"
          />

          <Button
            variant="contained"
            onClick={() => addItem(newItemName)}
            className="mt-4 w-full"
            sx={{
              margin: "11px 0 0",
              position: "relative",
              border: "1px solid #B1A4A4",
              background: " #000",
              boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
              "&:hover": {
                background: "#161616",
              },
            }}
          >
            ADD ITEM
          </Button>
        </div>
        <Button
          variant="contained"
          type="submit"
          className=" w-full"
          sx={{
            margin: "11px 0 0",
            position: "relative",
            border: "1px solid #B1A4A4",
            background: " #000",
            boxShadow: "0px 0px 4px 3px rgba(97, 92, 92, 0.44)",
            "&:hover": {
              background: "#161616",
            },
          }}
          onClick={generatePDF}
        >
          Generate PDF
        </Button>
      </div>
    </>
  );
};
