import { initialize } from "@jam-comments/client";

type Environment = "development" | "production";

class JamCommentsComponent extends HTMLElement {
  apiKey: string | null = null;
  domain: string | null = null;
  initializedCallback: string | null = null;

  constructor() {
    super();
  }

  get path() {
    return this.dataset.path || window.location.pathname;
  }

  get environment(): Environment {
    return (this.dataset.environment as Environment) || "production";
  }

  #validateAttributes() {
    this.apiKey = this.dataset.apiKey || null;
    this.domain = this.dataset.domain || window.location.hostname;
    this.initializedCallback = this.dataset.initializedCallback || null;

    if (!this.apiKey) {
      throw new Error("JamComments: The data-api-key attribute is required.");
    }
  }

  connectedCallback() {
    this.#validateAttributes();

    initialize(this, {
      path: this.path,
      apiKey: this.apiKey,
      domain: this.domain,
      environment: this.environment,
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
