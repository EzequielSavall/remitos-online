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

app.post("/api/remitos", upload.single("foto"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se subió archivo (req.file undefined)" });
    }

    if (!req.file.buffer) {
      return res.status(400).json({ error: "El archivo no contiene buffer" });
    }

    const numero = req.body.numero;

    const cloudStream = cloudinary.uploader.upload_stream(
      {
        folder: "remitos",
        type: "authenticated",
        context: { numero: numero },
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error });
        }
        const nuevo = {
          numero,
          foto: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          fecha: new Date(),
        };
        res.json(nuevo);
      }
    );

    cloudStream.end(req.file.buffer);
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(500).json({ error: err?.message || String(err) });
  }
});

/* app.get("/api/remitos", (req, res) => {
  res.json(remitos);
}); */

app.get("/api/remitos", async (req, res) => {
  try {
    const resultados = await cloudinary.search
      .expression("folder=remitos AND type=authenticated")
      .with_field("context")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    console.log(`remitos: ${JSON.stringify(resultados)}`);

    const remitosCloud = resultados.resources.map((r) => ({
      numero: r.context?.numero || "sin-numero",
      foto: r.secure_url,
      public_id: r.public_id,
      format: r.format,
      fecha: r.created_at,
    }));

    res.json(remitosCloud);
  } catch (err) {
    console.error("Error obteniendo remitos:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/remitos/url", async (req, res) => {
  try {
    const { publicId, format } = req.query;

    const url = cloudinary.utils.private_download_url(publicId, format, {
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + 300, // 5 minutos
      attachment: false,
    });

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* app.put("/api/remitos/:id", (req, res) => {
  const id = Number(req.params.id);
  const nuevoNumero = req.body.numero;
  const remito = remitos.find(r => r.id === id);
  if (!remito) return res.status(404).json({ error: "No encontrado" });
  remito.numero = nuevoNumero;
  res.json(remito);
}); */

app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor corriendo en puerto 4000");
});
