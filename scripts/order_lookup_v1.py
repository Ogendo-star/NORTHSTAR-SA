import pandas as pd

orders = pd.read_json("../data/orders.json")


def get_order_status(order_id):
    """Look up an order by ID and return its raw record."""
    order = orders[orders["order_id"] == order_id]

    if order.empty:
        return None

    record = order.iloc[0]
    return {
        "order_id": record["order_id"],
        "status": record["status"],
        "expected_delivery": record["expected_delivery"],
        "last_update": record["last_update"]
    }


if __name__ == "__main__":
    print(get_order_status("ORD-1002"))
    print(get_order_status("ORD-9999"))