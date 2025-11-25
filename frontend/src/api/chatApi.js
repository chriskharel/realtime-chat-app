import API from "./api.js";

export const fetchChatsRequest = () => API.get("/chat");
export const accessChatRequest = (otherUserId) =>
  API.post("/chat/access", { otherUserId });
export const deleteChatRequest = (chatId) => API.delete(`/chat/${chatId}`);

