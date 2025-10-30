import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });
let remitos = [];

app.post("/api/upload", upload.single("foto"), async (req, res) => {
  try {
    const numero = req.body.numero;
    const stream = cloudinary.uploader.upload_stream(
      { folder: "remitos" },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        const nuevo = { id: Date.now(), numero, foto: result.secure_url, fecha: new Date() };
        remitos.push(nuevo);
        res.json(nuevo);
      }
    );
    req.file.stream.pipe(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/remitos", (req, res) => {
  res.json(remitos);
});

app.put("/api/remitos/:id", (req, res) => {
  const id = Number(req.params.id);
  const nuevoNumero = req.body.numero;
  const remito = remitos.find(r => r.id === id);
  if (!remito) return res.status(404).json({ error: "No encontrado" });
  remito.numero = nuevoNumero;
  res.json(remito);
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});
