import userEvent from "@testing-library/user-event";
import Greeting from "./Greeting";
import { render, screen } from "@testing-library/react";

describe("Greeting component", () => {
  test("renders 'Hello World' text", () => {
    // Arrange
    render(<Greeting />);

    // Act
    // nothing

    // Assert
    const helloWorldElement = screen.getByText("Hello World!");
    expect(helloWorldElement).toBeInTheDocument();
  });

  test("renders 'good to see you' text while button was not clicked", () => {
    // Arrange
    render(<Greeting />);

    // Act
    // nothing

    // Assert
    const goodToSeeYouElement = screen.getByText("good to see you", {
      exact: false,
    });
    expect(goodToSeeYouElement).toBeInTheDocument();
  });

  test("renders 'Changed!' text once button was clicked", () => {
    // Arrange
    render(<Greeting />);

    // Act
    const buttonElement = screen.getByRole("button");
    userEvent.click(buttonElement);

    // Assert
    const outputElement = screen.getByText("Changed!");
    expect(outputElement).toBeInTheDocument();
  });

  test("does not render 'good to see you' after the button was clicked", () => {
    // Arrange
    render(<Greeting />);

    // Act
    const buttonElement = screen.getByRole("button");
    userEvent.click(buttonElement);

    // Assert
    const notGoodToSeeYouElement = screen.queryByText("good to see you", {
      exact: false,
    });
    expect(notGoodToSeeYouElement).toBeNull();
  });
});
