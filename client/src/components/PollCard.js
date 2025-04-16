// components/PollCard.js
import React from "react";
import "./PollCard.css";

const PollCard = ({ title, image, onClick }) => {
  return (
    <div className="poll-card" onClick={onClick}>
      <img src={image} alt={title} className="poll-image" />
    </div>
  );
};

export default PollCard;
