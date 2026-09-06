const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');
const { wcagCriterionFromTags } = require('./wcagMap');

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || '*';
const NAV_TIMEOUT_MS = 20000;
const MAX_NODES_PER_RULE = 5;

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Deducted once per distinct rule that fires, not once per element it fires on.
// A rule that fails on twenty elements is one problem, not twenty.
const IMPACT_WEIGHTS = { critical: 15, serious: 8, moderate: 4, minor: 2 };

function computeScore(violations) {
  const penalty = violations.reduce((sum, v) => sum + (IMPACT_WEIGHTS[v.impact] || IMPACT_WEIGHTS.minor), 0);
  return Math.max(0, Math.min(100, Math.round(100 - penalty)));
}

// axe-core's own rule text is inconsistently punctuated, so make sure
// everything we render out reads as a finished sentence.
function ensurePeriod(text) {
  if (!text) return text;
  const trimmed = text.trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function normalizeUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw new Error('Please enter a URL.');
  }
  let candidate = rawUrl.trim();
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error('That does not look like a valid URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http and https URLs are supported.');
  }
  return parsed.toString();
}

function transformResults(axeResults) {
  const summary = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const issues = [];

  for (const violation of axeResults.violations) {
    const impact = violation.impact || 'minor';
    const wcagCriterion = wcagCriterionFromTags(violation.tags);
    const nodes = violation.nodes.slice(0, MAX_NODES_PER_RULE);

    for (const node of nodes) {
      summary[impact] = (summary[impact] || 0) + 1;
      issues.push({
        id: violation.id,
        impact,
        wcagCriterion,
        description: ensurePeriod(violation.description || violation.help),
        htmlSnippet: node.html,
        suggestedFix: ensurePeriod(
          node.failureSummary?.replace(/^Fix (any|all) of the following:\s*/i, '').trim() ||
            violation.help
        ),
        helpUrl: violation.helpUrl,
      });
    }
  }

  const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  issues.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);

  return {
    score: computeScore(axeResults.violations),
    totalIssues: issues.length,
    summary,
    issues,
  };
}

async function runAudit(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: NAV_TIMEOUT_MS });
    } catch {
      throw new Error(
        'Could not load that site in time. It may be blocking automated visits or taking too long to respond.'
      );
    }

    const axeResults = await new AxePuppeteer(page).analyze();
    return transformResults(axeResults);
  } finally {
    await browser.close();
  }
}

app.post('/api/scan', async (req, res) => {
  let url;
  try {
    url = normalizeUrl(req.body?.url);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const report = await runAudit(url);
    res.json({ url, ...report });
  } catch (err) {
    console.error('Scan failed for', url, err);
    res.status(502).json({ error: err.message || 'Scan failed. Try a different URL.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`SightlineScan API listening on port ${PORT}`);
});
