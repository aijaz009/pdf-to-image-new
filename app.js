const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Render the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle image upload and conversion to PDF
app.post('/convert', upload.single('image'), (req, res) => {
    const doc = new PDFDocument();

    // Set the appropriate headers for streaming
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=image.pdf');

    // Pipe the PDF directly to the response
    doc.pipe(res);

    // Add the image to the PDF
    doc.image(req.file.path, {
        fit: [500, 700],
        align: 'center',
        valign: 'center'
    });

    doc.end();

    // Optional: Clean up the uploaded image after sending the PDF
    doc.on('finish', () => {
        fs.unlinkSync(req.file.path); // Delete the uploaded image
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
