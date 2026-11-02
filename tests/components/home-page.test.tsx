import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the brand statement and the two launch ecosystems", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Independent by Trade. Connected by Paradise.");
    expect(screen.getByText("Paradise Network")).toBeInTheDocument();
    expect(screen.getByText("Paradise Exchange")).toBeInTheDocument();
  });
});
