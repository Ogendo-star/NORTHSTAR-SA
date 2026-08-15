from order_lookup import get_order_status

# --- Normal cases: valid IDs, expect matching status ---
normal_cases = [
    ("ORD-1001", "PROCESSING"),
    ("ORD-1002", "SHIPPED"),
    ("ORD-1003", "OUT_FOR_DELIVERY"),
    ("ORD-1004", "DELIVERED"),
    ("ORD-1005", "DELAYED"),
]

# --- Error case: unknown ID ---
error_cases = [
    "ORD-9999",
]

# --- Edge cases: odd formatting / bad input ---
edge_cases = [
    ("ord-1002", "SHIPPED"),   # lowercase -> should normalize and match
    ("ORD 1002", None),        # space instead of dash -> should NOT match (expected fail)
    ("", None),                # empty string -> should return friendly error
    ("12345", None),           # nonsense ID -> should return not-found
]


def run_tests():
    passed = 0
    failed = 0

    print("=== Normal cases ===")
    for order_id, expected_status in normal_cases:
        result = get_order_status(order_id)
        ok = result.get("status") == expected_status
        print(f"{order_id}: {'PASS' if ok else 'FAIL'} -> {result}")
        passed += ok
        failed += not ok

    print("\n=== Error case ===")
    for order_id in error_cases:
        result = get_order_status(order_id)
        ok = "error" in result
        print(f"{order_id}: {'PASS' if ok else 'FAIL'} -> {result}")
        passed += ok
        failed += not ok

    print("\n=== Edge cases ===")
    for order_id, expected_status in edge_cases:
        result = get_order_status(order_id)
        if expected_status is None:
            ok = "error" in result
        else:
            ok = result.get("status") == expected_status
        print(f"'{order_id}': {'PASS' if ok else 'FAIL'} -> {result}")
        passed += ok
        failed += not ok

    print(f"\n{passed} passed, {failed} failed")


if __name__ == "__main__":
    run_tests()