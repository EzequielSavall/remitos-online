import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { RemitoResponse } from "./constants/RemitoResponse";

import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
} from "@mui/material";

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
      const res = await axios.get<RemitoResponse[]>(`${API_URL}/remitos`);
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
    formData.append("foto", file);

    try {
      const res = await axios.post(`${API_URL}/remitos`, formData);
      alert("Remito cargado correctamente");
      setFile(null);
      setNumero("");
      getRemitos();
    } catch (err) {
      console.error("Error subiendo remito:", err);
      alert("Error al subir remito");
    }
  };

  const abrirRemito = (public_id: string, format: string) => async () => {
    try {
      const res = await axios.get(`${API_URL}/remitos/url`, {
        params: { publicId: public_id, format },
      });

      window.open(res.data.url, "_blank");
    } catch (err) {
      console.error("Error generando URL segura:", err);
    }
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h4">📦 Remitos Online</Typography>

      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Número de remito"
          value={numero}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNumero(e.target.value)
          }
        />

        <Button variant="contained" component="label">
          Seleccionar Archivo
          <input
            type="file"
            hidden
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!e.target.files || e.target.files.length === 0) return;
              setFile(e.target.files[0]);
            }}
          />
        </Button>

        <Button variant="contained" color="primary" onClick={uploadRemito}>
          Cargar Remito
        </Button>
      </Box>

      <Typography variant="h5" mt={4}>
        Remitos entregados
      </Typography>

      <List>
        {remitos.map((r: RemitoResponse) => (
          <ListItem key={r.public_id}>
            {r.numero}
            <Typography
              component="span"
              ml={2}
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={abrirRemito(r.public_id, r.format)}
            >
              Abrir
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
