import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ButtonCard } from "./ButtonCard";
describe("ButtonCard Component", () => {
  const mockButtonClick = jest.fn();

  const renderButtonCard = () => {
    return render(
      <ButtonCard buttonLabel="Test Button" onButtonClick={mockButtonClick} />
    );
  };

  it("renders the button label correctly", () => {
    renderButtonCard();
    const button = screen.getByText("Test Button");
    expect(button).toBeInTheDocument();
  });

  it("calls the onButtonClick function when the button is clicked", () => {
    renderButtonCard();
    const button = screen.getByText("Test Button");
    fireEvent.click(button);
    expect(mockButtonClick).toHaveBeenCalled();
  });
});
