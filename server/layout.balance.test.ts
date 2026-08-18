import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Layout rCoin balance query", () => {
  it("only starts after login and refreshes when the header mounts", () => {
    const layoutSource = readFileSync(
      resolve(process.cwd(), "client/src/components/Layout.tsx"),
      "utf8",
    );

    expect(layoutSource).toContain("enabled: isLoggedIn");
    expect(layoutSource).toContain('refetchOnMount: "always"');
    expect(layoutSource).toContain("staleTime: 0");
    expect(layoutSource).toContain("const { user, isAuthenticated, logout } = useAuth();");
  });

  it("routes social sign-in through the OAuth portal instead of local-only login state", () => {
    const signInSource = readFileSync(
      resolve(process.cwd(), "client/src/components/SignInPanel.tsx"),
      "utf8",
    );

    expect(signInSource).toContain("window.location.href = getLoginUrl();");
  });

  it("uses the OAuth session for Home game-start access", () => {
    const homeSource = readFileSync(
      resolve(process.cwd(), "client/src/pages/Home.tsx"),
      "utf8",
    );

    expect(homeSource).toContain("const { isAuthenticated } = useAuth();");
    expect(homeSource).toContain("const isLoggedIn = isAuthenticated;");
  });
});
