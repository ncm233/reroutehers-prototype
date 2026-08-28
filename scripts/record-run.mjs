/**
 * Turns the JUnit output of the last gate run into a dated Markdown record.
 *
 *   node scripts/record-run.mjs
 *
 * Writes docs/test-runs/<date>-<sha>.md, one row per acceptance check,
 * aggregated across browser projects.
 */
import { execSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const JUNIT_PATH = 'results/junit.xml';
const OUTPUT_DIR = 'docs/test-runs';

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

function gitInfo() {
  const read = (cmd) => {
    try {
      return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  };

  return { sha: read('git rev-parse --short HEAD'), branch: read('git branch --show-current') };
}

/** Pulls the story id out of 'E1 — Epic name > US1.1 — does a thing'. */
function splitTitle(title) {
  const leaf = title.split('\u203a').pop().trim();
  const match = leaf.match(/(US\d+\.\d+)\s*[\u2014-]\s*(.*)$/);

  return match ? { us: match[1], check: match[2] } : { us: '\u2014', check: leaf };
}

function collect(suites, into = []) {
  for (const suite of toArray(suites)) {
    for (const testcase of toArray(suite.testcase)) {
      into.push({
        title: testcase['@_name'],
        time: Number(testcase['@_time'] ?? 0),
        failed: Boolean(testcase.failure ?? testcase.error),
        skipped: Boolean(testcase.skipped),
      });
    }
    collect(suite.testsuite, into);
  }
  return into;
}

function aggregate(cases) {
  const byTitle = new Map();

  for (const testcase of cases) {
    const entry = byTitle.get(testcase.title) ?? {
      ...splitTitle(testcase.title),
      projects: 0,
      failed: 0,
      skipped: 0,
      time: 0,
    };

    entry.projects += 1;
    entry.failed += testcase.failed ? 1 : 0;
    entry.skipped += testcase.skipped ? 1 : 0;
    entry.time = Math.max(entry.time, testcase.time);

    byTitle.set(testcase.title, entry);
  }

  return [...byTitle.values()].sort((a, b) => a.us.localeCompare(b.us));
}

function formatDuration(seconds) {
  return seconds < 1 ? `${Math.round(seconds * 1000)} ms` : `${seconds.toFixed(1)} s`;
}

function render(rows, { sha, branch }, timestamp) {
  const passed = rows.filter((row) => !row.failed && !row.skipped).length;
  const failed = rows.filter((row) => row.failed).length;
  const skipped = rows.filter((row) => row.skipped && !row.failed).length;

  const lines = [
    `# Acceptance run — ${timestamp}`,
    '',
    `Commit \`${sha}\` on \`${branch}\``,
    '',
    `**${passed} passed · ${failed} failed · ${skipped} skipped** across ${rows.length} acceptance checks.`,
    '',
    '| US | Acceptance check | Result | Projects | Duration |',
    '| --- | --- | --- | --- | --- |',
  ];

  for (const row of rows) {
    const result = row.failed ? `FAIL (${row.failed})` : row.skipped ? 'SKIPPED' : 'PASS';
    const check = row.check.replaceAll('|', '\\|');

    lines.push(
      `| ${row.us} | ${check} | ${result} | ${row.projects} | ${formatDuration(row.time)} |`
    );
  }

  return `${lines.join('\n')}\n`;
}

const xml = await readFile(JUNIT_PATH, 'utf8').catch(() => {
  throw new Error(`No ${JUNIT_PATH}. Run the e2e suite before recording a run.`);
});

const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
const rows = aggregate(collect(parsed.testsuites?.testsuite));

const info = gitInfo();
const now = new Date();
const stamp = now.toISOString().slice(0, 10);

await mkdir(OUTPUT_DIR, { recursive: true });
const outputPath = `${OUTPUT_DIR}/${stamp}-${info.sha}.md`;
await writeFile(outputPath, render(rows, info, now.toISOString().replace('T', ' ').slice(0, 19)));

console.log(`Recorded ${rows.length} acceptance checks -> ${outputPath}`);
