// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkNickname: vi.fn(),
  updateNickname: vi.fn(),
  invalidateMe: vi.fn(),
  logout: vi.fn(),
  setLocation: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    auth: {
      me: {
        useQuery: () => ({ data: { id: 1, name: "Ryan Kim", createdAt: new Date() } }),
      },
    },
    user: {
      profile: {
        useQuery: () => ({ data: { id: 1, name: "Ryan Kim", csCode: "90000000001" } }),
      },
      updateNickname: {
        useMutation: () => ({ mutateAsync: mocks.updateNickname }),
      },
      withdraw: {
        useMutation: () => ({ mutateAsync: vi.fn() }),
      },
    },
    useUtils: () => ({
      user: { checkNickname: { fetch: mocks.checkNickname } },
      auth: { me: { invalidate: mocks.invalidateMe } },
    }),
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: true, logout: mocks.logout }),
}));

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  useLocation: () => ["/my-page", mocks.setLocation],
}));

vi.mock("sonner", () => ({ toast: mocks.toast }));

import MyPage from "@/pages/MyPage";

describe("My Page nickname search DOM flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mocks.checkNickname.mockImplementation(async ({ name }: { name: string }) => ({
      isAvailable: name !== "Taken Nickname",
    }));
  });

  it("renders User ID and controls Save from Search availability results", async () => {
    const user = userEvent.setup();
    render(<MyPage />);

    expect((await screen.findAllByText("Ryan Kim")).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("User ID").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("CS Code").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByRole("columnheader").slice(0, 3).map((heading) => heading.textContent)).toEqual([
      "User ID",
      "Nickname",
      "CS Code",
    ]);

    await user.click(screen.getByRole("button", { name: /change nickname/i }));
    const input = screen.getByPlaceholderText("Enter new nickname");
    const search = screen.getByRole("button", { name: "Search" });
    const save = screen.getByRole("button", { name: "Save" });

    expect(save.hasAttribute("disabled")).toBe(true);
    await user.clear(input);
    await user.type(input, "Available Nickname");
    await user.click(search);
    expect(await screen.findByText("This nickname is available.")).toBeTruthy();
    await waitFor(() => expect(save.hasAttribute("disabled")).toBe(false));

    await user.clear(input);
    await user.type(input, "Taken Nickname");
    expect(save.hasAttribute("disabled")).toBe(true);
    await user.click(search);
    expect(await screen.findByText("This nickname is already in use.")).toBeTruthy();
    expect(save.hasAttribute("disabled")).toBe(true);
  });
});
