import type { Project, Task, User } from "../models/types";

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  console.log(
    `[authFetch] URL: ${url}, Token present: ${!!token}, Token starts with: ${token ? token.substring(0, 10) : "none"}`,
  );

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    console.error(`[authFetch] API Error on ${url}: Status ${response.status}`);
    if (response.status === 403 || response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return response.text();
};

export const api = {
  login: async (username: string, password: string) => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  register: async (username: string, password: string) => {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Registration failed: User may already exist.");
      }
      throw new Error("Registration failed");
    }
    return null;
  },

  getMe: (): Promise<User> => authFetch("/auth/me"),

  getProjects: (): Promise<Project[]> => authFetch("/project/"),
  getProject: (id: number): Promise<Project> => authFetch(`/project/${id}`),

  updateTask: (task: Task): Promise<Task> =>
    authFetch("/task/", {
      method: "PUT",
      body: JSON.stringify(task),
    }),
};
