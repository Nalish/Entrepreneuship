import { useCart } from "../Context/CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalAmount,
  } = useCart();

  if (!cartItems.length) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div>
      <h2>Cart</h2>

      {cartItems.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <strong>{item.name}</strong>
          <p>KES {item.price}</p>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              updateQuantity(item.id, Number(e.target.value))
            }
          />

          <button onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: KES {totalAmount.toFixed(2)}</h3>

      <button>Checkout</button>
    </div>
  );
};

export default Cart;
