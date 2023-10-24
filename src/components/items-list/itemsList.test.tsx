import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ItemsList } from "./ItemsList";

describe("ItemsList Component", () => {
  const mockOnButtonClick = jest.fn();

  const items = ["Item 1", "Item 2", "Item 3"];

  it("renders the label", () => {
    render(
      <ItemsList
        label="Test Label"
        items={items}
        onButtonClick={mockOnButtonClick}
        onButtonAddClick={mockOnButtonClick}
        visibleAddButton={false}
      />,
    );

    const labelElement = screen.getByText("Test Label");
    expect(labelElement).toBeInTheDocument();
  });

  it("renders the items", () => {
    render(
      <ItemsList
        label="Test Label"
        items={items}
        onButtonClick={mockOnButtonClick}
        onButtonAddClick={mockOnButtonClick}
        visibleAddButton={false}
      />,
    );

    const itemElements = screen.getAllByRole("listitem");
    expect(itemElements).toHaveLength(items.length);

    items.forEach((item, index) => {
      const itemElement = screen.getByText(item);
      expect(itemElement).toBeInTheDocument();

      const deleteIcons = screen.getAllByAltText("delete");
      if (deleteIcons.length > 0) {
        fireEvent.click(deleteIcons[0]);
      }
    });
  });
});
