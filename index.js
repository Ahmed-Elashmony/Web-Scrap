import puppeteer from "puppeteer-core";

const ChromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function scrapeTwitterAccount(url, ticker) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: ChromePath,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const tweets = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("article div[lang]")).map(
        (tweet) => tweet.innerText
      );
    });

    const mentions = tweets.filter((tweet) => tweet.includes(ticker));
    return mentions.length;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return 0;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function scrapeAccounts(accounts, ticker, interval) {
  const startTime = new Date();
  console.log(`Scraping for ${ticker} every ${interval} minutes...`);

  setInterval(async () => {
    let totalMentions = 0;
    for (const account of accounts) {
      const url = account;
      const mentions = await scrapeTwitterAccount(url, ticker);
      totalMentions += mentions;
    }

    const endTime = new Date();
    const elapsedTime = Math.round((endTime - startTime) / 60000);
    console.log(
      `"${ticker}" was mentioned "${totalMentions}" times in the last "${elapsedTime}" minutes.`
    );
  }, interval * 60000);
}

// Inputs
const accounts = [
  "https://twitter.com/Mr_Derivatives",
  "https://twitter.com/warrior_0719",
  "https://twitter.com/ChartingProdigy",
  "https://twitter.com/allstarcharts",
  "https://twitter.com/yuriymatso",
  "https://twitter.com/TriggerTrades",
  "https://twitter.com/AdamMancini4",
  "https://twitter.com/CordovaTrades",
  "https://twitter.com/Barchart",
  "https://twitter.com/RoyLMattox",
];
const ticker = "$TSLA";
const interval = 15; // in minutes

scrapeAccounts(accounts, ticker, interval);
