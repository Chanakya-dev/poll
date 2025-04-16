import React from "react";
import PollCard from "./PollCard";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import "./ScenaryPage.css";

const polls = [
  {
    title: "Captain America Vs Ironman",
    image: "/cap-vs-ironman.jpg",
    scene: "civilwar", // updated from room to scene
  },
  {
    title: "Batman Vs Superman",
    image: "/Batman.jpg",
    scene: "justice", // updated from room to scene
  },
  {
    title: "Nature Vs Development",
    image: "/Disaster.jpg",
    scene: "disaster", // updated from room to scene
  },
  {
    title: "Cash Vs UPI",
    image: "/Cash.jpg",
    scene: "cashvsupi", // updated from room to scene
  },
  {
    title: "Consistency Vs Motivation",
    image: "/Focus.jpg",
    scene: "consvsmot", // updated from room to scene
  },
  {
    title: "Social Media Vs Real Life",
    image: "/Digital.webp",
    scene: "socvsrl", // updated from room to scene
  },
  {
    title: "Logic Vs Emotions",
    image: "/Logic.jpg",
    scene: "logicvsemotions", // updated from room to scene
  },
  {
    title: "Faith Vs Science",
    image: "/Faith.png",
    scene: "faithvsscience", // updated from room to scene
  },
  {
    title: "Freedom Vs Security",
    image: "/freedom.webp",
    scene: "freedomvssecurity", // updated from room to scene
  },
];

const SceneryPage = () => {
  const { roomId } = useParams(); // Grab the roomId passed in the URL
  const navigate = useNavigate();

  const handleSceneSelect = (sceneId) => {
    // Redirect to PollRoom for the selected scene
    navigate(`/pollroom/${roomId}/${sceneId}`);
  };

  return (
    <div className="scenery-container">
      <h1 className="scenery-heading">Choose Your Battle</h1>
      <div className="polls-grid">
        {polls.map((poll) => (
          <PollCard
            key={poll.scene}
            title={poll.title}
            image={poll.image}
            onClick={() => handleSceneSelect(poll.scene)} // Navigate to PollRoom with roomId and scene
          />
        ))}
      </div>
    </div>
  );
};

export default SceneryPage;
