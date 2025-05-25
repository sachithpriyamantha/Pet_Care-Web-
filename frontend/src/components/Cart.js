import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import PaymentForm from "../pages/PaymentForm";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [isCheckout, setIsCheckout] = useState(false);

  const handlePaymentSuccess = (paymentData) => {
    clearCart();
    setIsCheckout(false);
    toggleCart();

    navigate("/order-confirmation", {
      state: { paymentIntentId: paymentData.id },
    });
  };

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const handleBackToCart = () => {
    setIsCheckout(false);
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          aria-labelledby="slide-over-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={toggleCart}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  {isCheckout ? (
                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2
                          className="text-lg font-medium text-gray-900"
                          id="slide-over-title"
                        >
                          Payment
                        </h2>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={toggleCart}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg
                              className="h-6 w-6"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-8">
                        <button
                          onClick={handleBackToCart}
                          className="mb-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          ← Back to Cart
                        </button>
                        <div className="mb-6">
                          <h3 className="text-md font-medium text-gray-900">
                            Order Summary
                          </h3>
                          <ul className="divide-y divide-gray-200">
                            {cart.map((item) => (
                              <li
                                key={item._id}
                                className="py-4 flex justify-between text-sm"
                              >
                                <span>
                                  {item.name} (x{item.quantity})
                                </span>
                                <span>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                            <p>Total</p>
                            <p>${getTotalPrice()}</p>
                          </div>
                        </div>
                        <PaymentForm
                          cart={cart}
                          totalPrice={parseFloat(getTotalPrice())}
                          onPaymentSuccess={handlePaymentSuccess}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <h2
                            className="text-lg font-medium text-gray-900"
                            id="slide-over-title"
                          >
                            Shopping cart
                          </h2>
                          <div className="ml-3 h-7 flex items-center">
                            <button
                              type="button"
                              className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={toggleCart}
                            >
                              <span className="sr-only">Close panel</span>
                              <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-8">
                          {cart.length === 0 ? (
                            <div className="text-center py-12">
                              <svg
                                className="mx-auto h-20 w-20 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1"
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                              <h3 className="mt-4 text-lg font-medium text-gray-900">
                                Your cart is empty
                              </h3>
                              <p className="mt-2 text-gray-500">
                                Start adding some products to your cart!
                              </p>
                              <button
                                onClick={toggleCart}
                                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Continue Shopping
                              </button>
                            </div>
                          ) : (
                            <div className="flow-root">
                              <ul
                                role="list"
                                className="-my-6 divide-y divide-gray-200"
                              >
                                {cart.map((item) => (
                                  <li key={item._id} className="py-6 flex">
                                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                      <img
                                        src={
                                          item.imageUrl ||
                                          "https://via.placeholder.com/150"
                                        }
                                        alt={item.name}
                                        className="w-full h-full object-center object-cover"
                                      />
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>{item.name}</h3>
                                          <p className="ml-4">
                                            $
                                            {(
                                              item.price * item.quantity
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                          {item.category}
                                        </p>
                                      </div>
                                      <div className="flex-1 flex items-end justify-between text-sm">
                                        <div className="flex items-center border border-gray-300 rounded-md">
                                          <button
                                            onClick={() =>
                                              updateQuantity(
                                                item._id,
                                                item.quantity - 1
                                              )
                                            }
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                                          >
                                            -
                                          </button>
                                          <span className="px-4 py-1 text-gray-800">
                                            {item.quantity}
                                          </span>
                                          <button
                                            onClick={() =>
                                              updateQuantity(
                                                item._id,
                                                item.quantity + 1
                                              )
                                            }
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                                          >
                                            +
                                          </button>
                                        </div>
                                        <div className="flex">
                                          <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                            onClick={() =>
                                              removeFromCart(item._id)
                                            }
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      {cart.length > 0 && (
                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>${getTotalPrice()}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            Shipping and taxes calculated at checkout.
                          </p>
                          <div className="mt-6">
                            <button
                              onClick={handleCheckout}
                              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Checkout
                            </button>
                          </div>
                          <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                            <p>
                              or{" "}
                              <button
                                type="button"
                                className="text-indigo-600 font-medium hover:text-indigo-500"
                                onClick={toggleCart}
                              >
                                Continue Shopping
                                <span aria-hidden="true"> →</span>
                              </button>
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
