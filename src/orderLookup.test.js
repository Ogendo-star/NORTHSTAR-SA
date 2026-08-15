import { getOrderStatus } from "./orderLookup.js";

// --- Normal cases: valid IDs, expect matching status ---
const normalCases = [
  ["ORD-1001", "PROCESSING"],
  ["ORD-1002", "SHIPPED"],
  ["ORD-1003", "OUT_FOR_DELIVERY"],
  ["ORD-1004", "DELIVERED"],
  ["ORD-1005", "DELAYED"],
];

// --- Error case: unknown ID ---
const errorCases = ["ORD-9999"];

// --- Edge cases: odd formatting / bad input ---
const edgeCases = [
  ["ord-1002", "SHIPPED"],   // lowercase -> should normalize and match
  ["ORD 1002", null],        // space instead of dash -> should NOT match
  ["", null],                // empty string -> should return friendly error
  ["12345", null],           // nonsense ID -> should return not-found
];

function runTests() {
  let passed = 0;
  let failed = 0;

  console.log("=== Normal cases ===");
  for (const [orderId, expectedStatus] of normalCases) {
    const result = getOrderStatus(orderId);
    const ok = result.status === expectedStatus;
    console.log(`${orderId}: ${ok ? "PASS" : "FAIL"} ->`, result);
    ok ? passed++ : failed++;
  }

  console.log("\n=== Error case ===");
  for (const orderId of errorCases) {
    const result = getOrderStatus(orderId);
    const ok = "error" in result;
    console.log(`${orderId}: ${ok ? "PASS" : "FAIL"} ->`, result);
    ok ? passed++ : failed++;
  }

  console.log("\n=== Edge cases ===");
  for (const [orderId, expectedStatus] of edgeCases) {
    const result = getOrderStatus(orderId);
    const ok = expectedStatus === null ? "error" in result : result.status === expectedStatus;
    console.log(`'${orderId}': ${ok ? "PASS" : "FAIL"} ->`, result);
    ok ? passed++ : failed++;
  }

  console.log(`\n${passed} passed, ${failed} failed`);
}

runTests();