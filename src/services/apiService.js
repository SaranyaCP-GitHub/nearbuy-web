import axios from "axios";

export const postRequest = async (url, bodyData = {}, headerData = {}) => {
  try {
    const response = await axios.post(url, bodyData, {
      headers: headerData,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getRequest = async (url, params = {}, headerData = {}) => {
  try {
    const response = await axios.get(url, {
      params: params,
      headers: headerData,
    });
    return response.data;
  } catch (error) {
    if (error.response.data.data === "The access token is invalid") {
      localStorage.removeItem("token");
      window.location.href = "/log-in";
    }
    return error.response;
  }
};

export const patchRequest = async (url, bodyData = {}, headerData = {}) => {
  try {
    const response = await axios.patch(url, bodyData, {
      headers: headerData,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const putRequest = async (url, bodyData = {}, headerData = {}) => {
  try {
    const response = await axios.put(url, bodyData, {
      headers: headerData,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const deleteRequest = async (url, headerData = {}, bodyData = {}) => {
  try {
    const response = await axios.delete(url, {
      headers: headerData,
      data: bodyData,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};
