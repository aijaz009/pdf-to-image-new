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
    const pdfPath = `uploads/${Date.now()}.pdf`;

    // Pipe the PDF into a file
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add the image to the PDF
    doc.image(req.file.path, {
        fit: [500, 700],
        align: 'center',
        valign: 'center'
    });

    doc.end();

    // Send the PDF file as a response
    doc.on('finish', () => {
        res.download(pdfPath, (err) => {
            if (err) {
                console.error(err);
            }
            // Optionally delete the uploaded image and generated PDF after download
            fs.unlinkSync(req.file.path); // Delete the uploaded image
            fs.unlinkSync(pdfPath); // Delete the generated PDF
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
