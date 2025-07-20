// scrape.js
const { chromium } = require('playwright');

const seeds = Array.from({ length: 10 }, (_, i) => 77 + i);
const baseUrl = 'https://sanand0.github.io/tdsdata/js_table/?seed=';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (let seed of seeds) {
    const url = `${baseUrl}${seed}`;
    await page.goto(url);

    const tableSums = await page.$$eval("table", tables =>
      tables.map(table => {
        const numbers = Array.from(table.querySelectorAll('td'))
          .map(td => parseFloat(td.textContent))
          .filter(n => !isNaN(n));
        return numbers.reduce((a, b) => a + b, 0);
      })
    );

    const pageSum = tableSums.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed} sum: ${pageSum}`);
    grandTotal += pageSum;
  }

  console.log("Total sum of all tables:", grandTotal);
  await browser.close();
})();
