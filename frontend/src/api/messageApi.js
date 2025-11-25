import API from "./api.js";

export const fetchMessagesRequest = (chatId) => API.get(`/message/${chatId}`);

export const sendMessageRequest = (chatId, content) =>
  API.post("/message/send", { chatId, content });

export const sendFileMessageRequest = (chatId, file, content = '') => {
  const formData = new FormData();
  formData.append('chatId', chatId);
  formData.append('content', content);
  formData.append('file', file);
  
  return API.post("/message/send", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMessageRequest = (messageId) => API.delete(`/message/${messageId}`);

