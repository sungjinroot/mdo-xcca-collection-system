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


// Helper to generate dynamic gallery pages (add this after your existing helpers)
const generateGalleryPages = (pictures, artifactName, getImagePath, logoToBase64, watermarkBase64) => {
    if (!pictures || pictures.length === 0) {
        return generateEmptyGalleryPage(artifactName, logoToBase64);
    }
    
    const photosPerPage = 4;
    const totalPages = Math.ceil(pictures.length / photosPerPage);
    let allPages = '';
    
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        const startIndex = pageNum * photosPerPage;
        const endIndex = Math.min(startIndex + photosPerPage, pictures.length);
        const pagePhotos = pictures.slice(startIndex, endIndex);
        
        allPages += generateGalleryPage(pagePhotos, artifactName, pageNum + 1, totalPages, getImagePath, logoToBase64, watermarkBase64);
    }
    
    return allPages;
};
const generateGalleryPage = (photos, artifactName, pageNum, totalPages, getImagePath, logoToBase64, watermarkBase64) => {    // Get logo base64 for this page
    const xccaLogoBase64 = logoToBase64('xcca-logo.png');
    const mdoLogoBase64 = logoToBase64('mdo-logo.png');
    const ommLogoBase64 = logoToBase64('omm-logo.png');
    const xuLogoBase64 = logoToBase64('xu-logo.png');
    
    // Generate the 2x2 grid
    let gridItems = '';
    for (let i = 0; i < 4; i++) {
        if (i < photos.length) {
            const photo = photos[i];
            const imageSrc = getImagePath(photo.picturefilepath);
            const watermarkTagSmall = watermarkBase64 ? `<img src="${watermarkBase64}" style="position: absolute; bottom: 8px; right: 8px; width: 20px; height: 20px; opacity: 0.4; pointer-events: none; z-index: 2;" />` : '';

            const imageTag = imageSrc && imageSrc.startsWith('http') 
                ? `<div style="position: relative; width: 100%; height: 100%;">
                    <img src="${imageSrc}" style="width:100%;height:100%;object-fit:cover;"/>
                    ${watermarkTagSmall}
                </div>`
                : `<div style="position: relative; width: 100%; height: 100%;">
                    <img src="file://${imageSrc}" style="width:100%;height:100%;object-fit:cover;"/>
                    ${watermarkTagSmall}
                </div>`;
        
            const caption = photo.anglename || 'View';
            const isProfile = photo.isprofilepicture ? ' (Profile)' : '';
            
            gridItems += `
                <div class="photo-cell">
                    <div class="photo-box">
                        ${imageTag}
                    </div>
                    <div class="photo-caption">${caption}${isProfile}</div>
                </div>
            `;
        }
    }
    
    return `
        <div class="page" id="page-gallery-${pageNum}" style="page-break-after: always; break-inside: avoid; page-break-inside: avoid;">
            <!-- Header -->
            <div class="page-header">
                <div class="header-logos"></div>
                <span class="museum-title">M U S E O &nbsp; D E &nbsp; O R O</span>
                <div class="header-xu-logo">
                    <img src="${xuLogoBase64}" alt="Xavier University logo" style="height:75px" />
                </div>
            </div>

            <!-- Institution logos row -->
            <div class="top-logos" style="justify-content:center;">
                <img src="${xccaLogoBase64}" style="height:100px;" />
                <img src="${mdoLogoBase64}" style="height:100px;" />
                <img src="${ommLogoBase64}" style="height:100px;" />
            </div>

            <!-- Artifact name title -->
            <div class="gallery-title">${(artifactName || 'ARTIFACT').toUpperCase().split('').join(' &nbsp; ')}</div>

            <!-- 2×2 photo grid -->
            <div class="photo-grid">
                ${gridItems}
            </div>
        </div>
    `;
};

const generateEmptyGalleryPage = (artifactName, logoToBase64) => {
    const xccaLogoBase64 = logoToBase64('xcca-logo.png');
    const mdoLogoBase64 = logoToBase64('mdo-logo.png');
    const ommLogoBase64 = logoToBase64('omm-logo.png');
    const xuLogoBase64 = logoToBase64('xu-logo.png');
    
    return `
        <div class="page" id="page-gallery-empty">
            <div class="page-header">
                <div class="header-logos"></div>
                <span class="museum-title">M U S E O &nbsp; D E &nbsp; O R O</span>
                <div class="header-xu-logo">
                    <img src="${xuLogoBase64}" alt="Xavier University logo" style="height:80px;" />
                </div>
            </div>

            <div class="top-logos" style="justify-content:center; margin-top:0rem; margin-bottom:1rem;">
                <img src="${xccaLogoBase64}" style="height:100px;" />
                <img src="${mdoLogoBase64}" style="height:100px;" />
                <img src="${ommLogoBase64}" style="height:100px;" />
            </div>

            <div class="gallery-title">${(artifactName || 'ARTIFACT').toUpperCase().split('').join(' &nbsp; ')}</div>
            
            <div style="text-align: center; padding: 2rem; font-family: var(--label-font); color: var(--muted);">
                No photos available for this artifact.
            </div>
        </div>
    `;
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
        
        const getProfilePicture = () => {
            const profilePic = pictures.find(p => p.isprofilepicture === true);
            return profilePic ? profilePic.picturefilepath : null;
        };

        // 3. Read HTML template
        const templatePath = path.resolve(__dirname, '../assets/layoutPage1.html');
        let html = fs.readFileSync(templatePath, 'utf8');

    // Helper function to convert watermark to base64
    const getWatermarkBase64 = () => {
        const watermarkPath = path.resolve(__dirname, '../assets/watermark.png');
        if (!fs.existsSync(watermarkPath)) return '';
        const base64 = fs.readFileSync(watermarkPath).toString('base64');
        return `data:image/png;base64,${base64}`;
    };

    // Then after you have the HTML content, add the watermark CSS:
    const watermarkBase64 = getWatermarkBase64();

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
        
// Replace main photo with watermark wrapper
const mainPhotoPath = getProfilePicture();
const watermarkTag = watermarkBase64 ? `<img src="${watermarkBase64}" style="position: absolute;top: 5px; left: 10px; width: 160px; height: 190px; opacity: 0.4; pointer-events: none; z-index: 2;" />` : '';

    if (mainPhotoPath) {
        const imageSrc = getImagePath(mainPhotoPath);
        // If it's a URL, use it directly
        if (imageSrc.startsWith('http')) {
            html = html.replace('MAIN_PHOTO_PLACEHOLDER', `
                <div style="position: relative; width: 100%; height: 100%;">
                    <img src="${imageSrc}" style="width:100%;height:100%;object-fit:cover;"/>
                    ${watermarkTag}
                </div>
            `);
        } else {
            // Local file path
            html = html.replace('MAIN_PHOTO_PLACEHOLDER', `
                <div style="position: relative; width: 100%; height: 100%;">
                    <img src="file://${imageSrc}" style="width:100%;height:100%;object-fit:cover;"/>
                    ${watermarkTag}
                </div>
            `);
        }
    }

// Generate dynamic gallery pages
const galleryPages = generateGalleryPages(pictures, artifact.englishname, getImagePath, logoToBase64, watermarkBase64);

// Replace the placeholder (ONLY ONCE)
const beforeReplace = html.length;
html = html.replace('<!-- GALLERY_PAGES_WILL_BE_INSERTED_HERE -->', galleryPages);       
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