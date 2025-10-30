import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getRemitos = () => axios.get(`${API_URL}/remitos`);

export const uploadRemito = async (numero, foto) => {
  const formData = new FormData();
  formData.append("numero", numero);
  formData.append("foto", foto);

  console.log("Enviando a:", `${API_URL}/remitos`);

  try {
    const res = await axios.post(`${API_URL}/remitos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (err) {
    console.error("Error al subir el remito:", err);
    alert("Error al subir el remito. Ver consola.");
  }
};
