import axios, { AxiosRequestConfig } from "axios";

type Fetcher = (url: string, config?: AxiosRequestConfig) => void;

export const fetcher: Fetcher = (url, config) =>
  axios.get(url, config).then((res) => res.data);
