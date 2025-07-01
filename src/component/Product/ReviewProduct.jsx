import React, { useState, useEffect } from "react";
import { Rate, Modal, Input, Button, message } from "antd";
import axios from "axios";
import { BASE_URL } from "../../API/BaseURL";
import DOMPurify from "dompurify";

const { TextArea } = Input;

const ReviewProduct = ({ productId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reviewSubject, setReviewSubject] = useState("");
  const [comments, setComments] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isReviewListOpen, setIsReviewListOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleOk = async () => {
    try {
      await axios.post(`${BASE_URL}/api/reviews`, {
        productId: productId,
        rating: rating,
        name: DOMPurify.sanitize(name),
        email: DOMPurify.sanitize(email),
        reviewSubject: DOMPurify.sanitize(reviewSubject),
        comments: DOMPurify.sanitize(comments),
      });

      message.success("Review submitted successfully!");
      setIsModalOpen(false);
      resetForm();
      fetchReviews();
    } catch (error) {
      message.error("Failed to submit review.");
    }
  };

  const showReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reviews/${productId}`);
      setReviews(response.data);
      setIsReviewListOpen(true);

      if (response.data && response.data.length > 0) {
        const totalRating = response.data.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(totalRating / response.data.length);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      message.error("Reviews are not available for this product.");
      setAverageRating(0);
      setReviews([]);
    }
  };

  const closeReviewListModal = () => {
    setIsReviewListOpen(false);
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reviews/${productId}`);
      setReviews(response.data);

      if (response.data && response.data.length > 0) {
        const totalRating = response.data.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(totalRating / response.data.length);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setAverageRating(0);
      setReviews([]);
    }
  };

  const resetForm = () => {
    setRating(0);
    setName("");
    setEmail("");
    setReviewSubject("");
    setComments("");
  };

  // Button style: faint variation of #40476D (slightly lighter)
  const buttonStyle = {
    backgroundColor: "#555a8a", // slightly lighter than #40476D
    color: "white",
    border: "none",
    borderRadius: 0,
    padding: "6px 15px",
    cursor: "pointer",
    fontWeight: "600",
    userSelect: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        {averageRating > 0 ? (
          <Rate
            allowHalf
            defaultValue={averageRating}
            disabled
            style={{ fontSize: "18px" }}
          />
        ) : (
          <span style={{ color: "#888" }}>★★★★★</span>
        )}
        <span
          style={{
            color: "#40476D",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "600",
            marginTop: "-16px",
            marginLeft: "64px",
            fontSize: "16px",
          }}
          onClick={showModal}
        >
          Review Product
        </span>
      </div>

      {/* Submit Review Modal */}
      <Modal
        title="Submit a Review"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: buttonStyle }}
        cancelButtonProps={{ style: buttonStyle }}
        okText="Submit"
        cancelText="Cancel"
        bodyStyle={{ backgroundColor: "white", color: "black" }}
        style={{ color: "black" }}
      >
        <Rate
          onChange={setRating}
          value={rating}
          style={{ marginBottom: "10px", color: "#40476D" }}
        />
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginBottom: "10px",
            color: "black",
            backgroundColor: "white",
            borderRadius: 0,
            borderColor: "#40476D",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
        />
        <Input
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            marginBottom: "10px",
            color: "black",
            backgroundColor: "white",
            borderRadius: 0,
            borderColor: "#40476D",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
        />
        <Input
          placeholder="Subject"
          value={reviewSubject}
          onChange={(e) => setReviewSubject(e.target.value)}
          style={{
            marginBottom: "10px",
            color: "black",
            backgroundColor: "white",
            borderRadius: 0,
            borderColor: "#40476D",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
        />
        <TextArea
          rows={4}
          placeholder="Your Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          style={{
            marginBottom: "10px",
            color: "black",
            backgroundColor: "white",
            borderRadius: 0,
            borderColor: "#40476D",
            borderStyle: "solid",
            borderWidth: "1px",
          }}
        />
      </Modal>

      <span
        onClick={showReviews}
        style={{
          color: "#40476D",
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: "600",
          userSelect: "none",
          fontSize: "16px",
          marginLeft: "155px",
          marginTop: "-50px",
        }}
      >
        See All Reviews
      </span>


      {/* Review List Modal */}
      <Modal
        title="Product Reviews"
        open={isReviewListOpen}
        onCancel={closeReviewListModal}
        footer={null} // Removed Return button
        bodyStyle={{ backgroundColor: "white", color: "black", padding: "20px" }}
        style={{ color: "black" }}
      >
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
                fontFamily: "Arial, sans-serif",
                color: "black",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "6px",
                }}
              >
                {/* Star rating top right */}
                <div>
                  <Rate
                    disabled
                    defaultValue={review.rating}
                    allowHalf
                    style={{ fontSize: "16px", color: "#40476D" }}
                  />
                </div>
              </div>

              {/* Email left below stars */}
              <div
                style={{
                  fontSize: "13px",
                  marginBottom: "4px",
                  fontWeight: "500",
                }}
              >
                {review.email}
              </div>

              {/* Name below email */}
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "15px",
                  marginBottom: "6px",
                }}
              >
                {review.name}
              </div>

              {/* Review content below name */}
              <div style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>
                {review.comments}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
      </Modal>
    </div>
  );
};

export default ReviewProduct;
