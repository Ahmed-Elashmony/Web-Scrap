# Web-Scrap

This Node.js script uses `puppeteer-core` to automate web scraping of Twitter accounts. It targets specific Twitter profiles and searches for tweets containing a particular ticker symbol, such as "$TSLA". The script launches a headless Chrome browser, navigates to each Twitter account, and collects all tweets on the page. It then filters the tweets for the specified ticker and counts how many times it was mentioned. The scraping process runs periodically based on a specified interval, providing ongoing monitoring of mentions.

## Features
- Uses `puppeteer-core` for headless browsing and data extraction.
- Capable of automating interactions with web pages.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmed-Elashmony/Web-Scrap.git
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

## Usage

Run the application with the following command:
```bash
node index.js
```
