import { useEffect, useState } from "react";
import { getRemitos, uploadRemito } from "./api";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function App() {
  const [numero, setNumero] = useState("");
  const [foto, setFoto] = useState(null);
  const [remitos, setRemitos] = useState([]);

  const cargarRemitos = async () => {
    const res = await getRemitos();
    setRemitos(res.data);
  };

  useEffect(() => {
    cargarRemitos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!numero || !foto) return alert("Ingresá número y foto del remito");

    await uploadRemito(numero, foto);
    await cargarRemitos();
    setNumero("");
    setFoto(null);
  };

  const editarNombre = async (id, actual) => {
    const nuevo = prompt("Nuevo número de remito:", actual);
    if (!nuevo || nuevo === actual) return;
    await axios.put(`${API_URL}/remitos/${id}`, { numero: nuevo });
    await cargarRemitos();
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>📦 Remitos Online</h1>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Número de remito"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files[0])}
          style={{ marginBottom: 10 }}
        />
        <button type="submit">Cargar Remito</button>
      </form>

      <h2>Remitos entregados</h2>
      <ul>
        {remitos.map((r) => (
          <li key={r.id} style={{ marginBottom: 20 }}>
            <b>N° {r.numero}</b>{" "}
            <button onClick={() => editarNombre(r.id, r.numero)}>✏️ Cambiar nombre</button>
            <br />
            <img
              src={r.foto}
              alt="Remito"
              width="100%"
              style={{ maxHeight: 300, objectFit: "contain", marginTop: 5 }}
            />
            <div><small>{new Date(r.fecha).toLocaleString()}</small></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
