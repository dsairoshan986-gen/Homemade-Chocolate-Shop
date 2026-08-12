import axios from "axios";

import API_URL from "../config/api";

const PRODUCTS_URL = `${API_URL}/products`;

export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};