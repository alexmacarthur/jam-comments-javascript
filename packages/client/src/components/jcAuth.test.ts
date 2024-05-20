import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import * as jcAuthModule from "./jcAuth";

const jcAuth = jcAuthModule.default;

const createMockComponent = () => {
  const component = jcAuth() as any;

  component.$refs = {
    shell: {
      dataset: {
        jamCommentsHost: "https://example.com",
      },
    },
  };

  return component;
};

beforeEach(() => {
  global.fetch = vi.fn();
});

describe("jcAuth", () => {
  it("loads fresh logged-in session from URL parameter", async () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://myblog.com/hey?jc_token=1234",
    } as Location);

    (fetch as any).mockResolvedValue({
      json: () =>
        Promise.resolve({
          avatar_url: "https://example.com",
          name: "John Doe",
        }),
      ok: true,
    });

    const component = createMockComponent();

    await component.init();

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/verify",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Jc-Token": "1234",
        },
      }),
    );

    expect(component.isAuthenticated).toBe(true);
    expect(component.avatar_url).toBe("https://example.com");
    expect(component.name).toBe("John Doe");
    expect(document.cookie).toMatch(/jc_token=1234;expires=.+ GMT;path=\/;/);
  });

  it("loads logged-in session from cookie", async () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://myblog.com/hey?jc_token=4567",
    } as Location);

    document.cookie = `jc_token=4567;expires=${new Date().toUTCString()};path=/;`;

    (fetch as any).mockResolvedValue({
      json: () =>
        Promise.resolve({
          avatar_url: "https://example.com",
          name: "John Doe",
        }),
      ok: true,
    });

    const component = createMockComponent();

    await component.init();

    expect(fetch).toHaveBeenCalledWith(
      "https://example.com/api/verify",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-Jc-Token": "4567",
        },
      }),
    );

    expect(component.isAuthenticated).toBe(true);
    expect(component.avatar_url).toBe("https://example.com");
    expect(component.name).toBe("John Doe");
    expect(document.cookie).toMatch(/jc_token=4567;expires=.+ GMT;path=\/;/);
  });

  it("token is invalid", async () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://myblog.com/hey?jc_token=bad-token",
    } as Location);

    // Authentication failed!
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    const component = createMockComponent();

    await component.init();

    expect(fetch).toHaveBeenCalledOnce();
    expect(component.isAuthenticated).toBe(false);
  });

  it("does not validate token when there isn't one", async () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://myblog.com/hey",
    } as Location);

    const component = createMockComponent();

    await component.init();

    expect(fetch).not.toHaveBeenCalled();
    expect(component.isAuthenticated).toBe(false);
  });

  it("removes jc_token from URL", async () => {
    vi.spyOn(window, "location", "get").mockReturnValue({
      href: "https://myblog.com/hey?something=true&jc_token=hello&something-else=ho",
    } as Location);

    const replaceSpy = vi.spyOn(window.history, "replaceState");

    (fetch as any).mockResolvedValue({
      json: () =>
        Promise.resolve({
          avatar_url: "https://example.com",
          name: "John Doe",
        }),
      ok: true,
    });

    const component = createMockComponent();

    await component.init();

    expect(replaceSpy).toHaveBeenCalledWith(
      {},
      null,
      "https://myblog.com/hey?something=true&something-else=ho",
    );
  });

  describe("logIn()", () => {
    it("constructs login URL", () => {
      const windowSpy = vi.spyOn(window, "open");
      vi.spyOn(window, "location", "get").mockReturnValue({
        href: "https://myblog.com/hey",
      } as Location);

      const component = createMockComponent();

      component.logIn();

      expect(windowSpy).toHaveBeenCalledWith(
        `https://example.com/by/login?comment_url=${encodeURIComponent(
          "https://myblog.com/hey",
        )}`,
      );
    });

    it("appends parent comment ID when it exists", () => {
      const windowSpy = vi.spyOn(window, "open");
      vi.spyOn(window, "location", "get").mockReturnValue({
        href: "https://myblog.com/hey",
      } as Location);

      const component = createMockComponent();

      component.parentCommentId = 3;

      component.logIn();

      expect(windowSpy).toHaveBeenCalledWith(
        `https://example.com/by/login?comment_url=${encodeURIComponent(
          "https://myblog.com/hey",
        )}&parent_comment=3`,
      );
    });
  });
});
