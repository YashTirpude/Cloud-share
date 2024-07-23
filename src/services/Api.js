import axios from "axios";

const API_URL = "http://localhost:5000";

export const uploadFile = async (data) => {
  try {
    let response = await axios.post(`${API_URL}/upload`, data);
    return response.data;
  } catch (error) {
    console.error("Error while calling the api", error.message);
  }
};

export const downloadFile = async (fileId) => {
  try {
    let response = await axios.get(`${API_URL}/file/${fileId}`, {
      responseType: "blob", // Important: This tells axios to treat the response as binary data
    });
    return response;
  } catch (error) {
    console.error("Error while calling the download api", error.message);
    throw error;
  }
};
