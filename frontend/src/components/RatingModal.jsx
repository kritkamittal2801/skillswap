import { useState } from "react";

const RatingModal = ({ onSubmit, onClose }) => {

  const [stars, setStars] =
    useState(5);

  const [review, setReview] =
    useState("");

  const handleSubmit = () => {

    if (!stars) {
      alert("Please select a rating");
      return;
    }

    onSubmit(
      stars,
      review
    );

  };

  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
        }}
      >

        <h2>
          Rate Your Session
        </h2>

        <p>
          How was your experience?
        </p>

        {/* Stars */}

        <div
          style={{
            fontSize: "32px",
            cursor: "pointer",
            marginBottom:
              "15px",
          }}
        >

          {[1, 2, 3, 4, 5].map(
            (star) => (

              <span
                key={star}
                onClick={() =>
                  setStars(star)
                }
              >
                {
                  star <= stars
                    ? "⭐"
                    : "☆"
                }
              </span>

            )
          )}

        </div>

        {/* Review */}

        <textarea
          rows="4"
          placeholder="Write your review..."
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
          }}
        />

        <br />
        <br />

        <button
          onClick={
            handleSubmit
          }
        >
          Submit Review
        </button>

        <button
          onClick={onClose}
          style={{
            marginLeft:
              "10px",
          }}
        >
          Cancel
        </button>

      </div>

    </div>

  );

};

export default RatingModal;