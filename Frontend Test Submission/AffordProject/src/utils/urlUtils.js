import { log } from './logger.js';

const URL_STORAGE_KEY = 'shortenedUrls';

const getAllLinks = () => {
  const data = localStorage.getItem(URL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save our data back to localStorage.
const saveLinks = (links) => {
  localStorage.setItem(URL_STORAGE_KEY, JSON.stringify(links));
};

// This just gives out a random 6-char string. Good enough for this project.
export const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const createShortUrl = (longUrl, customCode = null, validityInMinutes = 30) => {
  const allLinks = getAllLinks();
  let shortCode = customCode;

  if (customCode && allLinks.some(link => link.shortCode === customCode)) {
    log('error', 'utils', `Custom code "${customCode}" is already taken.`);
    return { success: false, error: `The name "${customCode}" is already in use. Please try another. `};
  }

  if (!shortCode) {
    do {
      shortCode = generateShortCode();
    } while (allLinks.some(link => link.shortCode === shortCode));
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + validityInMinutes * 60 * 1000);

  const newLinkEntry = {
    shortCode,
    longUrl,
    shortUrl: `${window.location.origin}/${shortCode}`,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    clickCount: 0,
    clicks: [],
  };

  allLinks.push(newLinkEntry);
  saveLinks(allLinks);

  // updated Using the real logger
  log('info', 'utils', `New link created: ${shortCode} -> ${longUrl.substring(0, 50)}...`);
  return { success: true, data: newLinkEntry };
};


export const findUrlByShortCode = (shortCode) => {
  const allLinks = getAllLinks();
  const link = allLinks.find(l => l.shortCode === shortCode);

  if (link) {
    // Check if the link is past its expiration date.
    if (new Date(link.expiresAt) < new Date()) {
        // UPDATED: Using the real logger
        log('warn', 'utils', `Expired link accessed: ${shortCode}`);
        return null; // Treat it as not found
    }
    return link;
  }
  return null;
};

// Records a click for a given short link.
export const logClick = (shortCode) => {
    let allLinks = getAllLinks();
    const linkToUpdate = allLinks.find(l => l.shortCode === shortCode);

    if (linkToUpdate) {
        linkToUpdate.clickCount++;
        linkToUpdate.clicks.push({
            timestamp: new Date().toISOString(),
            source: document.referrer || "Direct Link", // "Direct" is a bit cleaner than an empty string
            location: "N/A" // Placeholder as required by the doc
        });
        saveLinks(allLinks);
        log('info', 'utils', `Click recorded for short code: ${shortCode}`);
    }
};

export { getAllLinks };