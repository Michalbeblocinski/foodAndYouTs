import React from "react";
import { render, screen } from "@testing-library/react";
import { MediumRecipeCard } from "./MediumRecipeCard";
import { MemoryRouter } from "react-router-dom";

const mockProps = {
  mainPhoto: "example.jpg",
  title: "Sample Recipe",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  stars: 4,
  cookingTime: 30,
  _id: "123456",
  numberOfOpinions: 10,
  difficulty: "easy",
};

test("Render MediumRecipeCard", () => {
  render(
    <MemoryRouter>
      <MediumRecipeCard {...mockProps} />
    </MemoryRouter>
  );

  const titleElement = screen.getByText(/Sample Recipe/i);
  const descriptionElement = screen.getByText(/Lorem ipsum/i);
  const starsElements = screen.getAllByAltText("star");
  const cookingTimeElement = screen.getByText("30");

  expect(titleElement).toBeInTheDocument();
  expect(descriptionElement).toBeInTheDocument();
  expect(starsElements.length).toBe(4);
  expect(cookingTimeElement).toBeInTheDocument();
});
