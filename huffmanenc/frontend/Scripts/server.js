const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Huffman = require('./encoding');

const app = express();
const upload = multer({ dest: "uploads/" });
const huffman = new Huffman();

app.post("/upload", upload.single("uploadfile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filepath = path.join(__dirname, req.file.path);

  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    }

    // Encode the data using Huffman encoding
    const encodedStr = huffman.encode(data);
    const binaryData = huffman.toBinary(encodedStr);

    // Save the binary data to a .bin file
    const binFilePath = path.join(__dirname, 'uploads', `${req.file.filename}.bin`);
    fs.writeFile(binFilePath, binaryData, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save binary file" });
      }

      // Respond with the path to the encoded file
      res.json({
        message: 'File uploaded and encoded successfully',
        encodedFilePath: binFilePath
      });

      // Clean up the original file
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error('Failed to delete original file:', err);
        }
      });
    });
  });
});

app.listen(3000, () => {
  console.log("Server running at 3000");
});
