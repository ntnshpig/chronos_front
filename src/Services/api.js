import axios from "axios";

export default function api() {
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000"
  });

  return api;
}
