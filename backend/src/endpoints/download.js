const express = require('express');
const endpoint = express.Router();
const pool = require('../db');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Helper to get image file path (no base64 conversion)
const getImagePath = (filePath) => {
    if (!filePath) return null;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        return filePath;  // Return the URL directly
    }
    
    // Otherwise, treat it as a local file path
    return path.resolve(__dirname, '../images', filePath);
};

// Helper to get logo file path (no base64 conversion)
const getLogoPath = (filename) => {
    if (!filename) return null;
    return path.resolve(__dirname, '../assets', filename);
};

endpoint.get('/pdf/:id', async (req, res) => {
    let browser;
    try {
        const { id } = req.params;

        // 1. Fetch artifact data
        const artifactResult = await pool.query(`
    SELECT 
        a.artifactID,
        a.accessionNo,
        a.catalogueNo,
        a.roomID,
        a.storageLocation,

        an.englishName,
        an.vernacularName,

        ap.ethnicGroup,
        ap.locality,
        ap.placeOfOrigin,

        cp.contactPersonFullName,
        TO_CHAR(cp.dateCollectedByContactPerson, 'YYYY-MM-DD') as dateCollectedByContactPerson,
        cp.receiverFullName,
        TO_CHAR(cp.receivedByReceiverDate, 'YYYY-MM-DD') as receivedByReceiverDate,
        cp.recordedBy,

        d.artifactLength,
        d.artifactWidth,
        d.artifactHeight,
        d.artifactDiameter,

        pd.artifactDetails,
        pd.artifactFunction,
        pd.conditionUponReceipt,
        pd.specialRemarks,

        ac.collectionType,
        ac.price

    FROM Artifacts a
    LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
    LEFT JOIN ArtifactProvenance ap ON a.artifactID = ap.artifactID
    LEFT JOIN ContactPersons cp ON a.artifactID = cp.artifactID
    LEFT JOIN Dimensions d ON a.artifactID = d.artifactID
    LEFT JOIN PhysicalDescription pd ON a.artifactID = pd.artifactID
    LEFT JOIN Acquisition ac ON a.artifactID = ac.artifactID
    WHERE a.artifactID = $1
`, [id]);

        if (artifactResult.rows.length === 0) {
            return res.status(404).json({ error: 'Artifact not found' });
        }

        const artifact = artifactResult.rows[0];

        // 2. Fetch pictures
        const picturesResult = await pool.query(
            'SELECT * FROM pictures WHERE artifactid = $1',
            [id]
        );

        const pictures = picturesResult.rows;
        
        const getPicturePath = (angleName) => {
            const pic = pictures.find(p => p.anglename?.toLowerCase() === angleName.toLowerCase());
            return pic ? pic.picturefilepath : null;
        };

        // 3. Read HTML template
        const templatePath = path.resolve(__dirname, '../assets/layoutPage1.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const logoToBase64 = (filename) => {
            const resolved = path.resolve(__dirname, '../assets', filename);
            if (!fs.existsSync(resolved)) return '';
            const ext = path.extname(filename).substring(1);
            const base64 = fs.readFileSync(resolved).toString('base64');
            return `data:image/${ext};base64,${base64}`;
        };

        const ommLogoBase64 = logoToBase64('omm-logo.png');
        const xccaLogoBase64 = logoToBase64('xcca-logo.png');
        const mdoLogoBase64 = logoToBase64('mdo-logo.png');
        const xuLogoBase64 = logoToBase64('xu-logo.png');

        html = html.replace(/src="xcca-logo.png"/g, `src="${xccaLogoBase64}"`);
        html = html.replace(/src="mdo-logo.png"/g, `src="${mdoLogoBase64}"`);
        html = html.replace(/src="omm-logo.png"/g, `src="${ommLogoBase64}"`);
        html = html.replace(/src="xu-logo.png"/g, `src="${xuLogoBase64}"`);
        
    // Replace main photo
    const mainPhotoPath = getPicturePath('front');
        if (mainPhotoPath) {
        const imageSrc = getImagePath(mainPhotoPath);
        // If it's a URL, use it directly
        if (imageSrc.startsWith('http')) {
            // CHANGE THIS LINE - wrap imageSrc in an img tag
            html = html.replace('MAIN_PHOTO_PLACEHOLDER', `<img src="${imageSrc}" style="width:100%;height:100%;object-fit:cover;"/>`);
        } else {
            // Local file path
            html = html.replace('MAIN_PHOTO_PLACEHOLDER', `<img src="file://${imageSrc}" style="width:100%;height:100%;object-fit:cover;"/>`);
        }

}
        
        // Replace gallery photos
        const photos = {
            'FRONT PHOTO': getPicturePath('front'),
            'BACK PHOTO': getPicturePath('back'),
            'LEFT SIDE PHOTO': getPicturePath('left'),
            'RIGHT SIDE PHOTO': getPicturePath('right')
        };
        
        Object.entries(photos).forEach(([placeholder, photoPath]) => {
            if (photoPath) {
                const resolvedPath = getImagePath(photoPath);
                html = html.replace(placeholder, `<img src="file://${resolvedPath}" style="width:100%;height:100%;object-fit:cover;"/>`);
            }
        });
        
        // Replace text content
        html = html.replace('TEST ENGLISH NAME', artifact.englishname || 'N/A');
        html = html.replace('TEST VERNACULAR NAME', artifact.vernacularname || 'N/A');
        html = html.replace('ROOM 1', artifact.storagelocation || 'N/A');
        html = html.replace(/Test number/g, artifact.accessionno || 'N/A');
        
        // Handle dimensions
        html = html.replace(/Testing/g, (match, offset, string) => {
            // Check context to determine which dimension to use
            const context = string.substring(Math.max(0, offset - 50), offset + 50);
            if (context.includes('Diameter')) return artifact.artifactdiameter || 'N/A';
            if (context.includes('Length')) return artifact.artifactlength || 'N/A';
            if (context.includes('Width')) return artifact.artifactwidth || 'N/A';
            if (context.includes('Height')) return artifact.artifactheight || 'N/A';
            return 'N/A';
        });
        
        // Handle dates
        html = html.replace(/5\/1\/26/g, (match, offset, string) => {
            const context = string.substring(Math.max(0, offset - 50), offset + 50);
            if (context.includes('Date Given')) return artifact.datecollectedbycontactperson || 'N/A';
            if (context.includes('Date Received')) return artifact.receivedbyreceiverdate || 'N/A';
            return 'N/A';
        });
        
        // Handle other text fields
        html = html.replace('Test recorder', artifact.recordedby || 'N/A');
        html = html.replace('Test receiver', artifact.receiverfullname || 'N/A');
        html = html.replace('Test donor', artifact.contactpersonfullname || 'N/A');
        html = html.replace('Test group', artifact.ethnicgroup || 'N/A');
        html = html.replace('Test place', artifact.placeoforigin || 'N/A');
        html = html.replace('Test locality', artifact.locality || 'N/A');
        html = html.replace('DONATED', artifact.collectiontype || 'N/A');
        html = html.replace('NO FUNCTION TESTING', artifact.artifactfunction || 'N/A');
        html = html.replace('GOOD UPON RECEIVED', artifact.artifactdetails || 'N/A');
        html = html.replace('GOOD kaayo', artifact.conditionuponreceipt || 'N/A');
        
        // Handle gallery title
        const galleryTitle = (artifact.englishname || 'ARTIFACT').toUpperCase().split('').join(' &nbsp; ');
        html = html.replace('E N G L I S H &nbsp; N A M E', galleryTitle);
        
        // Handle data-field attributes
        const dataFields = {
            'vernacular_name': artifact.vernacularname,
            'english_name': artifact.englishname,
            'storage_location': artifact.storagelocation,
            'accession_number': artifact.accessionno,
            'catalogue_number': artifact.catalogueno,
            'diameter': artifact.artifactdiameter,
            'length_cm': artifact.artifactlength,
            'width_cm': artifact.artifactwidth,
            'height_cm': artifact.artifactheight,
            'date_given': artifact.datecollectedbycontactperson,
            'date_received': artifact.receivedbyreceiverdate,
            'recorded_by': artifact.recordedby,
            'receiver_name': artifact.receiverfullname,
            'donor_name': artifact.contactpersonfullname,
            'ethnic_group': artifact.ethnicgroup,
            'place_of_origin': artifact.placeoforigin,
            'locality': artifact.locality,
            'how_collected': artifact.collectiontype,
            'function': artifact.artifactfunction,
            'details': artifact.artifactdetails,
            'condition': artifact.conditionuponreceipt
        };

        Object.entries(dataFields).forEach(([field, value]) => {
            const regex = new RegExp(`data-field="${field}">[^<]*<`, 'g');
            html = html.replace(regex, `data-field="${field}">${value || 'N/A'}<`);
        });

        // 5. Launch Puppeteer and generate PDF
        browser = await puppeteer.launch({
            args: ['--no-sandbox',
                '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        // 6. Send PDF as response (preview mode)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="artifact-${id}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF ERROR:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (browser) await browser.close();
    }
});

module.exports = endpoint; 