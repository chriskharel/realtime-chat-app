import API from "./api.js";

// Profile management
export const getUserProfileRequest = (userId) => API.get(`/user/profile/${userId || ''}`);
export const updateUserProfileRequest = (data) => API.put("/user/profile", data);

// Avatar management
export const uploadAvatarRequest = (formData) => 
  API.post("/user/avatar", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteAvatarRequest = () => API.delete("/user/avatar");

// Message read receipts
export const markMessageAsReadRequest = (messageId) => API.put(`/message/${messageId}/read`);
export const markChatAsReadRequest = (chatId) => API.put(`/message/chat/${chatId}/read`);
export const getUnreadCountRequest = (chatId) => API.get(`/message/chat/${chatId}/unread-count`);
