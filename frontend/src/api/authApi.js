import API from "./api.js";

export const loginRequest = (payload) => API.post("/auth/login", payload);
export const registerRequest = (payload) => API.post("/auth/register", payload);

