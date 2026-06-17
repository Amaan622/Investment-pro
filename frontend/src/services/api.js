const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// Auth
export const authAPI = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

// Dashboard
export const dashboardAPI = {
  get: () => request("/dashboard"),
  roiHistory: (page = 1) => request(`/dashboard/roi-history?page=${page}&limit=20`),
  referralTree: () => request("/dashboard/referral-tree"),
};

// Investments
export const investmentsAPI = {
  create: (body) => request("/investments", { method: "POST", body: JSON.stringify(body) }),
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/investments?${qs}`);
  },
  getById: (id) => request(`/investments/${id}`),
};
