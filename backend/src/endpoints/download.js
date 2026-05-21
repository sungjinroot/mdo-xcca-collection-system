const express = require('express');
const endpoint = express.Router();
const pool = require('../db');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// helper to convert image file to base64 img tag
const imageToBase64Tag = (filePath, style = '') => {
    if (!filePath) return '<div style="height:200px;background:#eee;"></div>'
    const resolved = path.resolve(__dirname, '../images', filePath)
    if (!fs.existsSync(resolved)) return '<div style="height:200px;background:#eee;"></div>'
    const ext = path.extname(filePath).substring(1)
    const base64 = fs.readFileSync(resolved).toString('base64')
    return `<img src="data:image/${ext};base64,${base64}" ${style}/>`
}

// helper to convert logo to base64 img tag
const logoToBase64Tag = (filename) => {
    const resolved = path.resolve(__dirname, '../images/assets', filename)
    if (!fs.existsSync(resolved)) return ''
    const ext = path.extname(filename).substring(1)
    const base64 = fs.readFileSync(resolved).toString('base64')
    return `<img src="data:image/${ext};base64,${base64}" style="height:60px;" />`
}

endpoint.get("/pdf/:id", async (req, res) => {
    const { id } = req.params
    let browser;

    try {
        // 1. Fetch artifact data
        const artifactResult = await pool.query(`
            SELECT 
                a.artifactID, a.accessionNo, a.catalogueNo, a.roomID, a.storageLocation,
                an.englishName, an.vernacularName,
                ap.ethnicGroup, ap.locality, ap.placeOfOrigin,
                cp.contactPersonFullName, cp.dateCollectedByContactPerson, 
                cp.receiverFullName, cp.receivedByReceiverDate, cp.recordedBy,
                d.artifactLength, d.artifactWidth, d.artifactHeight, d.artifactDiameter,
                pd.artifactDetails, pd.artifactFunction, pd.conditionUponReceipt, pd.specialRemarks,
                ac.collectionType, ac.price
            FROM Artifacts a
            LEFT JOIN ArtifactNames an ON a.artifactID = an.artifactID
            LEFT JOIN ArtifactProvenance ap ON a.artifactID = ap.artifactID
            LEFT JOIN ContactPersons cp ON a.artifactID = cp.artifactID
            LEFT JOIN Dimensions d ON a.artifactID = d.artifactID
            LEFT JOIN PhysicalDescription pd ON a.artifactID = pd.artifactID
            LEFT JOIN Acquisition ac ON a.artifactID = ac.artifactID
            WHERE a.artifactID = $1
        `, [id])

        if (artifactResult.rows.length === 0) {
            return res.status(404).json({ error: 'Artifact not found' })
        }

        const artifact = artifactResult.rows[0]

        // 2. Fetch pictures
        const picturesResult = await pool.query(
            'SELECT * FROM Pictures WHERE artifactID = $1', [id]
        )
        const pictures = picturesResult.rows
        const getPicturePath = (angleName) => {
            const pic = pictures.find(p => p.anglename?.toLowerCase() === angleName.toLowerCase())
            return pic ? pic.picturefilepath : null
        }

        // 3. Read HTML template
        const templatePath = path.resolve(__dirname, '../assets/layoutPage1.html')
        let html = fs.readFileSync(templatePath, 'utf8')

        // 4. Replace placeholders with actual data
        const replacements = {
            '{{ommLogo}}': logoToBase64Tag('omm.jpg'),
            '{{xccaLogo}}': logoToBase64Tag('xcca.png'),
            '{{mdoLogo}}': logoToBase64Tag('mdo.jpg'),
            '{{profileImage}}': imageToBase64Tag(getPicturePath('front'), 'style="width:200px;height:200px;object-fit:cover;"'),
            '{{frontImage}}': imageToBase64Tag(getPicturePath('front'), 'style="width:100%;height:250px;object-fit:cover;"'),
            '{{backImage}}': imageToBase64Tag(getPicturePath('back'), 'style="width:100%;height:250px;object-fit:cover;"'),
            '{{leftImage}}': imageToBase64Tag(getPicturePath('left'), 'style="width:100%;height:250px;object-fit:cover;"'),
            '{{rightImage}}': imageToBase64Tag(getPicturePath('right'), 'style="width:100%;height:250px;object-fit:cover;"'),
            '{{englishname}}': artifact.englishname || '',
            '{{vernacularname}}': artifact.vernacularname || '',
            '{{storagelocation}}': artifact.storagelocation || '',
            '{{accessionno}}': artifact.accessionno || '',
            '{{catalogueno}}': artifact.catalogueno || '',
            '{{artifactdiameter}}': artifact.artifactdiameter || '',
            '{{artifactlength}}': artifact.artifactlength || '',
            '{{artifactwidth}}': artifact.artifactwidth || '',
            '{{artifactheight}}': artifact.artifactheight || '',
            '{{datecollectedbycontactperson}}': artifact.datecollectedbycontactperson || '',
            '{{receivedbyreceiverdate}}': artifact.receivedbyreceiverdate || '',
            '{{recordedby}}': artifact.recordedby || '',
            '{{receiverfullname}}': artifact.receiverfullname || '',
            '{{contactpersonfullname}}': artifact.contactpersonfullname || '',
            '{{ethnicgroup}}': artifact.ethnicgroup || '',
            '{{placeoforigin}}': artifact.placeoforigin || '',
            '{{locality}}': artifact.locality || '',
            '{{collectiontype}}': artifact.collectiontype || '',
            '{{artifactfunction}}': artifact.artifactfunction || '',
            '{{artifactdetails}}': artifact.artifactdetails || '',
            '{{conditionuponreceipt}}': artifact.conditionuponreceipt || '',
            '{{englishnameUpper}}': (artifact.englishname || '').toUpperCase(),
        }

        // replace all placeholders in the template
        for (const [placeholder, value] of Object.entries(replacements)) {
            html = html.replaceAll(placeholder, value)
        }

        // 5. Launch Puppeteer and generate PDF
        browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })

        // 6. Send PDF as response
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename="artifact-${id}.pdf"`)
        res.send(pdfBuffer)

    } catch (error) {
        console.error('PDF ERROR:', error)
        res.status(500).json({ error: error.message })
    } finally {
        if (browser) await browser.close()
    }
})

module.exports = endpoint;