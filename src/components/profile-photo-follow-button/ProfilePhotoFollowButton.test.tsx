import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ProfilePhotoFollowButton } from "./ProfilePhotoFollowButton";

const mockProps = {
  imageUrl: "example.jpg",
  handleFollow: jest.fn(),
};

test("Render profile photo follow button", () => {
  render(
    <MemoryRouter>
      <ProfilePhotoFollowButton {...mockProps} />
    </MemoryRouter>
  );

  const imgElement = screen.getByAltText("profile");
  expect(imgElement).toBeInTheDocument();
  expect(imgElement).toHaveAttribute("src", "example.jpg");
  const followButton = screen.getByText("Follow");
  expect(followButton).toBeInTheDocument();

  fireEvent.click(followButton);
});
