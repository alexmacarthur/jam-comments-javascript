import { initialize } from ".";

type Environment = "development" | "production";

class JamCommentsComponent extends HTMLElement {
  constructor() {
    super();

    this.#validateAttributes();
  }

  get path() {
    return this.dataset.path || window.location.pathname;
  }

  get environment(): Environment {
    return (this.dataset.environment as Environment) || "production";
  }

  #validateAttributes() {
    if (!this.dataset.apiKey) {
      throw new Error("JamComments: The data-api-key attribute is required.");
    }

    if (!this.dataset.domain) {
      throw new Error("JamComments: The data-domain attribute is required.");
    }
  }

  connectedCallback() {
    initialize(this, {
      path: this.path,
      apiKey: this.dataset.apiKey,
      domain: this.dataset.domain,
      environment: this.environment,
    }).then(() => {
      const initializedCallback = globalThis[this.dataset.initializedCallback];

      if (typeof initializedCallback === "function") {
        initializedCallback();
      }
    });
  }
}

customElements.define("jam-comments", JamCommentsComponent);

export { JamCommentsComponent };
