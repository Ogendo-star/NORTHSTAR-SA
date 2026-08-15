from fastapi import FastAPI
from order_lookup import get_order_status

app = FastAPI()


@app.get("/")
def root():
    """Just confirms the API is alive when you visit the base URL."""
    return {"message": "Order Status API is running"}


@app.get("/order-status/{order_id}")
def order_status(order_id: str):
    """
    Frontend calls this like:
    http://localhost:8000/order-status/ORD-1002

    Returns the same JSON shape as get_order_status() already did.
    """
    return get_order_status(order_id)