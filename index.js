import puppeteer from "puppeteer-core";

// Path to the Chrome executable on your machine
const ChromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Function to scrape a Twitter account for tweets containing a specific ticker
async function scrapeTwitterAccount(url, ticker) {
  let browser;
  try {
    // Launch a new instance of the browser
    browser = await puppeteer.launch({
      headless: true, // Run the browser in headless mode (without UI)
      executablePath: ChromePath, // Path to the Chrome executable
    });

    // Open a new page/tab in the browser
    const page = await browser.newPage();

    // Navigate to the specified URL and wait until the network is idle
    await page.goto(url, { waitUntil: "networkidle2" });

    try {
      // Wait for the tweets to load
      await page.waitForSelector("article div[lang]", { timeout: 10000 });
    } catch (error) {
      // Log a message and return 0 mentions if timeout occurs
      console.log(`Timeout waiting for tweets on ${url}`);
      return 0;
    }

    // Extract tweets from the page
    const tweets = await page.evaluate(() => {
      // Get all tweet elements and extract their inner text
      return Array.from(document.querySelectorAll("article div[lang]")).map(
        (tweet) => tweet.innerText
      );
    });

    // Filter tweets that contain the specified ticker
    const mentions = tweets.filter((tweet) => tweet.includes(ticker));

    // Return the count of mentions
    return mentions.length;
  } catch (error) {
    // Log any errors that occur during scraping
    console.error(`Error scraping ${url}:`, error);
    return 0; // Return 0 if an error occurs
  } finally {
    // Ensure the browser is closed when done
    if (browser) {
      await browser.close();
    }
  }
}

// Function to scrape multiple Twitter accounts periodically
async function scrapeAccounts(accounts, ticker, interval) {
  // Record the start time of the scraping process
  const startTime = new Date();
  console.log(`Scraping for ${ticker} every ${interval} minutes...`);

  // Set up a recurring interval to scrape accounts
  setInterval(async () => {
    let totalMentions = 0;

    // Iterate over each account URL
    for (const account of accounts) {
      // Scrape the account for mentions of the ticker
      const mentions = await scrapeTwitterAccount(account, ticker);
      // Accumulate the total number of mentions
      totalMentions += mentions;
    }

    // Record the end time of the current scraping cycle
    const endTime = new Date();
    // Calculate the elapsed time in minutes
    const elapsedTime = Math.round((endTime - startTime) / 60000);
    // Log the results
    console.log(
      `"${ticker}" was mentioned "${totalMentions}" times in the last "${elapsedTime}" minutes.`
    );
  }, interval * 60000); // Convert the interval from minutes to milliseconds
}

// Inputs: list of Twitter account URLs, ticker to search for, and interval in minutes
// Accounts Provided
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
const ticker = "$TSLA"; // Ticker symbol to search for in tweets
const interval = 15; // Scraping interval in minutes

// Start the scraping process
scrapeAccounts(accounts, ticker, interval);
