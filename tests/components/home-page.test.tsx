import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/(marketing)/page";

describe("Landing page", () => {
  it("leads with the brand statement and a sign-up call to action", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Independent by Trade. Connected by Paradise.");
    const joinLinks = screen.getAllByRole("link", { name: /join paradise/i });
    expect(joinLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of joinLinks) expect(link).toHaveAttribute("href", "/sign-up");
  });

  it("covers the launch ecosystems and is honest that points do not transfer yet", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /be the name that comes up/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ask for what you need/i })).toBeInTheDocument();
    expect(screen.getByText(/no points change hands yet/i)).toBeInTheDocument();
  });

  it("lists the launch-area towns", () => {
    render(<HomePage />);
    const towns = screen.getByRole("list", { name: /towns in the launch area/i });
    expect(within(towns).getByText("Lititz")).toBeInTheDocument();
    expect(within(towns).getByText("Ephrata")).toBeInTheDocument();
  });
});
