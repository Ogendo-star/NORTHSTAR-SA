/**
 * test_returns.js
 * Manual test suite for returnsLogic.js — no framework, just assert +
 * a results log, so the audit trail (Person 5's job) can point to a
 * file showing every policy case was actually verified.
 *
 * Run with: node tests/test_returns.js
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { returnsLookup } = require("../returnsLogic.js");
const dataset = require("../data/orders.json");

// Fixed "today" so results are reproducible — mirrors the real system
// treating "today" as whatever date the ticket comes in.
const TODAY = new Date("2026-08-15");

const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ name, status: "PASS" });
    console.log(`PASS - ${name}`);
  } catch (err) {
    results.push({ name, status: "FAIL", error: err.message });
    console.log(`FAIL - ${name}\n       ${err.message}`);
  }
}

test("Eligible return within window (ORD1001, 10 days since delivery)", () => {
  const res = returnsLookup("ORD1001", dataset, TODAY);
  assert.strictEqual(res.case, "eligible");
  assert.strictEqual(res.daysRemaining, 20);
});

test("Expired return window (ORD1002, 45 days since delivery)", () => {
  const res = returnsLookup("ORD1002", dataset, TODAY);
  assert.strictEqual(res.case, "expired");
});

test("Already returned + refund processed (ORD1003)", () => {
  const res = returnsLookup("ORD1003", dataset, TODAY);
  assert.strictEqual(res.case, "already_returned");
  assert.strictEqual(res.refundStatus, "processed");
});

test("Not yet delivered - shipped status (ORD1004)", () => {
  const res = returnsLookup("ORD1004", dataset, TODAY);
  assert.strictEqual(res.case, "not_delivered");
});

test("Boundary: 29 days since delivery still eligible (ORD1005)", () => {
  const res = returnsLookup("ORD1005", dataset, TODAY);
  assert.strictEqual(res.case, "eligible");
  assert.strictEqual(res.daysRemaining, 1);
});

test("Boundary: exactly 30 days since delivery still eligible (ORD1006)", () => {
  const res = returnsLookup("ORD1006", dataset, TODAY);
  assert.strictEqual(res.case, "eligible");
  assert.strictEqual(res.daysRemaining, 0);
});

test("Boundary: 31 days since delivery is expired (ORD1007)", () => {
  const res = returnsLookup("ORD1007", dataset, TODAY);
  assert.strictEqual(res.case, "expired");
});

test("Not yet delivered - processing status (ORD1008)", () => {
  const res = returnsLookup("ORD1008", dataset, TODAY);
  assert.strictEqual(res.case, "not_delivered");
});

test("Already returned + refund requested (ORD1009)", () => {
  const res = returnsLookup("ORD1009", dataset, TODAY);
  assert.strictEqual(res.case, "already_returned");
  assert.strictEqual(res.refundStatus, "requested");
});

test("Order not found (ORD9999)", () => {
  const res = returnsLookup("ORD9999", dataset, TODAY);
  assert.strictEqual(res.case, "not_found");
});

test("Invalid input - empty string", () => {
  const res = returnsLookup("", dataset, TODAY);
  assert.strictEqual(res.case, "invalid_input");
});

// ---- write results to a log file for the audit trail ----
const passCount = results.filter((r) => r.status === "PASS").length;
const summary =
  `# Returns/Refunds Test Results\n\n` +
  `Run date: ${new Date().toISOString()}\n` +
  `Result: ${passCount}/${results.length} passed\n\n` +
  `| Test | Status |\n|---|---|\n` +
  results.map((r) => `| ${r.name} | ${r.status} |`).join("\n") +
  "\n";

fs.writeFileSync(
  path.join(__dirname, "..", "test-results.md"),
  summary
);

console.log(`\n${passCount}/${results.length} tests passed. See test-results.md`);

if (passCount !== results.length) {
  process.exitCode = 1;
}
