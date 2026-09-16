const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("codebridge_token");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(body?.message || "Something went wrong. Please try again.");
    error.status = response.status;
    throw error;
  }

  return body;
}

export const authApi = {
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  profile: () => apiRequest("/auth/profile"),
};

export const courseApi = {
  list: (params) => apiRequest(`/courses?${new URLSearchParams(params)}`),
};

export const enrollmentApi = {
  enroll: (courseId) => apiRequest("/enrollments", { method: "POST", body: JSON.stringify({ course_id: courseId }) }),
  mine: () => apiRequest("/enrollments/my-courses"),
  drop: (courseId) => apiRequest(`/enrollments/${courseId}`, { method: "DELETE" }),
};
