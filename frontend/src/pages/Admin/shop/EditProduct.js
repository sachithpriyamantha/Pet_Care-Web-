import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBox,
  FaClipboardList,
  FaDollarSign,
  FaImage,
  FaPaw,
  FaSave,
  FaTag,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    stockQuantity: "",
    petType: "",
  });

  const {
    name,
    category,
    price,
    description,
    imageUrl,
    stockQuantity,
    petType,
  } = formData;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        const product = response.data;

        setFormData({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl || "",
          stockQuantity: product.stockQuantity,
          petType: product.petType,
        });

        setImagePreview(product.imageUrl || "");
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product");
        setLoading(false);
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!name || !price || !description || !stockQuantity) {
        setError("Please fill in all required fields");
        setSubmitLoading(false);
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
      };

      await axios.put(`http://localhost:5000/api/products/${id}`, productData);
      setSubmitLoading(false);
      setSuccess("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating product");
      setSubmitLoading(false);
      console.error("Error updating product:", err);
    }
  };

  const categories = [
    "Food",
    "Toys",
    "Accessories",
    "Health",
    "Grooming",
    "Other",
  ];
  const petTypes = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Small Animal",
    "Reptile",
    "Other",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">
            Loading product data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Navigation */}
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-150"
        >
          <FaArrowLeft className="mr-2" />
          Back to products
        </Link>

        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-md p-6 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <FaClipboardList className="mr-3 text-indigo-600" />
            Edit Product
          </h1>
          <p className="mt-2 text-gray-600">
            Update the information for this product
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-1 shadow-md animate-fadeIn"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-1 shadow-md animate-fadeIn"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Two-column layout for form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left side form fields - 2 columns */}
                <div className="md:col-span-2 space-y-6">
                  {/* Product Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <div className="flex items-center">
                        <span>Product Name</span>
                        <span className="ml-1 text-red-500">*</span>
                      </div>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                  </div>

                  {/* Category and Pet Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <div className="flex items-center">
                          <FaTag className="mr-1 text-gray-500" />
                          <span>Category</span>
                        </div>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <select
                          id="category"
                          name="category"
                          value={category}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="petType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <div className="flex items-center">
                          <FaPaw className="mr-1 text-gray-500" />
                          <span>Pet Type</span>
                        </div>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <select
                          id="petType"
                          name="petType"
                          value={petType}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {petTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <div className="flex items-center">
                          <FaDollarSign className="mr-1 text-gray-500" />
                          <span>Price ($)</span>
                          <span className="ml-1 text-red-500">*</span>
                        </div>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={price}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="stockQuantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        <div className="flex items-center">
                          <FaBox className="mr-1 text-gray-500" />
                          <span>Stock Quantity</span>
                          <span className="ml-1 text-red-500">*</span>
                        </div>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="number"
                          id="stockQuantity"
                          name="stockQuantity"
                          value={stockQuantity}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <div className="flex items-center">
                        <FaImage className="mr-1 text-gray-500" />
                        <span>Image URL</span>
                      </div>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={imageUrl}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Provide a URL for the product image. Leave empty for no
                      image.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      <div className="flex items-center">
                        <span>Description</span>
                        <span className="ml-1 text-red-500">*</span>
                      </div>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="5"
                        placeholder="Enter product description"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Right side - image preview - 1 column */}
                <div className="md:col-span-1">
                  <div className="sticky top-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="mt-1 border border-gray-300 rounded-md overflow-hidden bg-gray-100 aspect-square">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x300?text=Invalid+Image+URL";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                          <FaImage className="text-5xl mb-2" />
                          <p className="text-center text-sm">
                            No image provided
                          </p>
                          <p className="text-center text-xs mt-2">
                            Enter a valid URL in the Image URL field to see a
                            preview
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      This is how your product will appear to customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-end gap-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
