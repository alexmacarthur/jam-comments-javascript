import { initialize } from "@jam-comments/client";

type Environment = "development" | "production";

class JamCommentsComponent extends HTMLElement {
  path: string;
  apiKey: string | null = null;
  domain: string | null = null;
  dateFormat: string | null = null;
  environment: Environment = "production";
  initializedCallback: string | null = null;
  copy: Record<string, string> = {};

  constructor() {
    super();
  }

  #validateAttributes() {
    this.apiKey = this.dataset.apiKey || null;
    this.domain = this.dataset.domain || window.location.hostname;
    this.initializedCallback = this.dataset.initializedCallback || null;
    this.environment =
      (this.dataset.environment as Environment) || "production";
    this.path = this.dataset.path || window.location.pathname;
    this.dateFormat = this.dataset.dateFormat || null;

    // Parse copy attributes
    this.copy = this.#parseCopyAttributes();

    if (!this.apiKey) {
      throw new Error("JamComments: The data-api-key attribute is required.");
    }
  }

  #parseCopyAttributes(): Record<string, string> {
    const copy: Record<string, string> = {};
    const copyPrefix = "copy";

    for (const [key, value] of Object.entries(this.dataset)) {
      if (key.startsWith(copyPrefix) && value) {
        // Convert camelCase to underscored format
        const underscoredKey = key
          .replace(/^copy/, "copy_")
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase();
        copy[underscoredKey] = value;
      }
    }

    return copy;
  }

  connectedCallback() {
    this.#validateAttributes();

    initialize(this, {
      path: this.path,
      apiKey: this.apiKey,
      domain: this.domain,
      environment: this.environment,
      dateFormat: this.dateFormat,
      copy: this.copy,
    })
      .then((el) => {
        const initializedCallback = globalThis[this.initializedCallback];

        if (typeof initializedCallback === "function") {
          initializedCallback(el);
        }
      })
      .catch((error) => {
        console.error("JamComments: Failed to initialize.", error);
      });
  }
}

customElements.define("jam-comments", JamCommentsComponent);

export { JamCommentsComponent };
