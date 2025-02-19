const express = require("express");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
  const readmePath = path.join(__dirname, "../README.md");

  // Read the README.md file
  fs.readFile(readmePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading README.md");
    }

    // Convert Markdown to HTML
    const htmlContent = marked.parse(data);

    // Send as an HTML page
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>README Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 120px; }
            pre { background: #f4f4f4; padding: 10px; }
          </style>
      </head>
      <body>
          <h1>README.md Preview</h1>
          ${htmlContent}
      </body>
      </html>
    `);
  });
});

module.exports = homeRouter;
