import pandas as pd

orders = pd.read_json("../data/orders.json")

STATUS_MESSAGES = {
    "PROCESSING": "Your order is being prepared.",
    "SHIPPED": "Your order has shipped.",
    "OUT_FOR_DELIVERY": "Your order is out for delivery.",
    "DELIVERED": "Your order has been delivered.",
    "DELAYED": "Your order has been delayed."
}


def get_order_status(order_id):
    """
    Look up an order by ID and return a dashboard-ready result.

    Returns:
        dict with order_id, status, message, expected_delivery, last_update
        OR dict with "error" if the order isn't found / input is invalid
    """
    if not order_id or not order_id.strip():
        return {"error": "Please enter an order ID."}

    order_id = order_id.strip().upper()  # normalize e.g. "ord-1002" -> "ORD-1002"

    order = orders[orders["order_id"] == order_id]

    if order.empty:
        return {"error": "We couldn't find that order. Please check your order ID."}

    record = order.iloc[0]
    status = record["status"]

    return {
        "order_id": record["order_id"],
        "status": status,
        "message": STATUS_MESSAGES[status],
        "expected_delivery": record["expected_delivery"],
        "last_update": record["last_update"]
    }


if __name__ == "__main__":
    print(get_order_status("ORD-1002"))
    print(get_order_status("ord-1002"))   # lowercase, should normalize
    print(get_order_status("ORD-9999"))   # not found
    print(get_order_status(""))           # empty input