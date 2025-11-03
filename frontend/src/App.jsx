import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function App() {
  const [remitos, setRemitos] = useState([]);
  const [file, setFile] = useState(null);
  const [numero, setNumero] = useState("");

  useEffect(() => {
    getRemitos();
  }, []);

  const getRemitos = async () => {
    try {
      const res = await axios.get(`${API_URL}/remitos`);
      setRemitos(res.data);
    } catch (err) {
      console.error("Error obteniendo remitos:", err);
    }
  };

  const uploadRemito = async () => {
    if (!file || !numero) {
      alert("Completá el número y seleccioná un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("numero", numero);
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/remitos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Remito cargado correctamente");
      setFile(null);
      setNumero("");
      getRemitos();
    } catch (err) {
      console.error("Error subiendo remito:", err);
      alert("Error al subir remito");
    }
  };

  return (
    <div className="p-4 text-center">
      <h1>📦 Remitos Online</h1>
      <input
        type="text"
        placeholder="Número de remito"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadRemito}>Cargar Remito</button>

      <h2>Remitos entregados</h2>
      <ul>
        {remitos.map((r) => (
          <li key={r._id}>{r.numero}</li>
        ))}
      </ul>
    </div>
  );
}
