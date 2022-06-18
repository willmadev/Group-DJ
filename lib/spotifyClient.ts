import axios, { AxiosResponse } from "axios";

export const handleAuthCode = async (code: string) => {
  let response: AxiosResponse<any, any>;
  try {
    response = await axios.get("/api/auth/spotify/authCodeGrant", {
      params: { code },
    });
  } catch (err) {
    console.error(err);
    return { error: true };
  }

  Object.keys(response.data).map((key: string) => {
    localStorage.setItem(key, response.data[key]);
  });
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    console.error("No Refresh Token");
    return { error: true };
  }
  let response: AxiosResponse<any, any>;
  try {
    response = await axios.post("/api/auth/spotify/refreshAccessToken", {
      refresh_token: refreshToken,
    });
  } catch (err) {
    console.error(err);
    return { error: true };
  }

  Object.keys(response.data).map((key: string) => {
    localStorage.setItem(key, response.data[key]);
  });
};
