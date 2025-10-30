import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getRemitos = () => axios.get(`${API_URL}/remitos`);
export const uploadRemito = (numero, foto) => {
  const formData = new FormData();
  formData.append("numero", numero);
  formData.append("foto", foto);
  return axios.post(`${API_URL}/upload`, formData);
};
