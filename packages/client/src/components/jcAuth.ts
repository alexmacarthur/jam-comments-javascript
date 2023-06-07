import { getStorage, removeStorage, setStorage } from "../storage";
import {
  deleteTokenFromCookie,
  getTokenFromCookie,
  removeTokenFromUrl,
} from "../utils";

export const postService = (endpoint: string, token: string) => {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-Jc-Token": token,
    },
  });
};

export default () => ({
  isAuthenticated: false,
  isShowingMenu: false,
  name: "",
  avatar_url: "",

  get base() {
    return this.$refs.shell.dataset.jamCommentsHost;
  },

  get apiBase() {
    return `${this.base}/api`;
  },

  async init() {
    // Before we do anything, check session storage for existing data first.
    // This will make for a more seamless experience for users who have already logged in.
    this.hydrateFromLocalSession();

    const token = await this.loadSession();

    if (token) {
      this.isAuthenticated = true;
    } else {
      removeStorage();
      this.setLoggedOutData();
    }
  },

  async loadSession(): Promise<string | null> {
    const { searchParams: params } = new URL(window.location.href);
    const token = params.get("jc_token") || getTokenFromCookie();

    if (!token) return null;

    const response = await postService(`${this.apiBase}/verify`, token);

    // Token is valid! Store it in a cookie.
    if (!response.ok) {
      return null;
    }

    removeTokenFromUrl();

    const { avatar_url, name } = await response.json();

    this.avatar_url = avatar_url;
    this.name = name;

    setStorage(avatar_url, name);

    // Cookie expires after 24 hours!
    const date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

    document.cookie = `jc_token=${token};expires=${date.toUTCString()};path=/;`;

    return token;
  },

  async logOut() {
    const token = getTokenFromCookie();
    const logoutEndpoint = `${this.apiBase}/logout`;

    await postService(logoutEndpoint, token);

    deleteTokenFromCookie();

    this.setLoggedOutData();
  },

  logIn() {    
    const queryParams: {
      comment_url: string;
      parent_comment?: string;
    } = {
      comment_url: window.location.href,
    }

    if(this.parentCommentId) {
      queryParams.parent_comment = this.parentCommentId;
    }

    const loginEndpoint = `${
      this.base
    }/by/login?${(new URLSearchParams(queryParams)).toString()}`;

    window.open(loginEndpoint);
  },

  setLoggedOutData() {
    this.isAuthenticated = false;
    this.avatar_url = "";
    this.name = "Anonymous";
  },

  hydrateFromLocalSession() {
    const storage = getStorage();

    if (storage) {
      this.avatar_url = storage.avatar_url;
      this.name = storage.name;
      this.isAuthenticated = true;
    }
  },
});
