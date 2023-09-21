const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3001;

app.use(express.json());

app.post('/api/automate', async (req, res) => {
    const { url, elementToClick, elementToCopy } = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    try {
        await page.goto(url);
        await page.click(elementToClick);
        await page.waitForTimeout(3000);

        const copiedText = await page.evaluate(elementToCopySelector => {
            const element = document.querySelector(elementToCopySelector);
            return element ? element.textContent : null;
        }, elementToCopy);

        const test = "Success"

        res.json({ copiedText });
    } catch (error) {
        res.status(500).json({ error: 'Error during automation.' });
    } finally {
        await browser.close();
    }
});

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = process.env.URL

    // Navigate the page to a URL
    await page.goto(url);

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForTimeout(15000)
    await page.click('.opblock-tag-section.is-open');
    await page.click('span:nth-child(2)');
    // await page.click('.opblock-summary.opblock-summary-get')
    await page.click('button.try-out__btn');

    await page.screenshot({ path: "swaggerTest.png" })
    await browser.close();

})();


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
