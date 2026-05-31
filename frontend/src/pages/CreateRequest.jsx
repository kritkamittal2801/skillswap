import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: "",
    subject: "",
    mode: "paid",
    coinAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.description ||
      !formData.subject ||
      !formData.mode
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/requests",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Request created successfully!");

      setFormData({
        description: "",
        subject: "",
        mode: "paid",
        coinAmount: "",
      });

      console.log(response.data);

      setTimeout(() => {
        navigate("/requests");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Learning Request
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe what help you need..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-2 font-medium">
              Subject
            </label>

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Subject</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="MongoDB">MongoDB</option>
              <option value="JavaScript">
                JavaScript
              </option>
              <option value="DSA">DSA</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">
                Mathematics
              </option>
              <option value="Chemistry">
                Chemistry
              </option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="block mb-2 font-medium">
              Learning Mode
            </label>

            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="paid">Paid</option>
              <option value="barter">Barter</option>
            </select>
          </div>

          {/* Coin Amount */}
          {formData.mode === "paid" && (
            <div>
              <label className="block mb-2 font-medium">
                Coin Amount
              </label>

              <input
                type="number"
                name="coinAmount"
                placeholder="Enter coins"
                value={formData.coinAmount}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading
              ? "Creating Request..."
              : "Create Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;