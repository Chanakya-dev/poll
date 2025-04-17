import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import pollsData from "../data/pollsData";
import "./PollRoom.css";

const POLL_DURATION = 60;

const PollRoom = () => {
  const { roomId, sceneId } = useParams();
  const navigate = useNavigate();
  const roomDetails = pollsData[sceneId];

  const [pollData, setPollData] = useState({
    title: roomDetails?.title || "",
    description: roomDetails?.description || "",
    options: roomDetails?.options || ["", ""],
    images: roomDetails?.images || ["", ""],
    votes: [0, 0],
    voted: false,
    userVoteIndex: null,
  });

  const [timeLeft, setTimeLeft] = useState(POLL_DURATION);
  const [votingEnded, setVotingEnded] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const voteKey = `votes-${roomId}-${sceneId}`;
    const userVoteKey = `${userName}-${roomId}-${sceneId}`;

    const storedVotes = localStorage.getItem(voteKey);
    const storedUserVote = localStorage.getItem(userVoteKey);

    if (storedVotes) {
      console.log(`[INIT] Loaded votes from localStorage: ${storedVotes}`);
    }

    setPollData((prev) => ({
      ...prev,
      votes: storedVotes ? JSON.parse(storedVotes) : [0, 0],
      voted: !!storedUserVote,
      userVoteIndex: storedUserVote ? JSON.parse(storedUserVote).optionIndex : null,
    }));

    socket.emit("joinRoom", {
      roomId,
      userName,
      sceneId,
      options: roomDetails?.options || ["", ""],
    });

    socket.on("timerStart", ({ startTime }) => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, POLL_DURATION - elapsed);
      console.log(`[SOCKET] timerStart received - elapsed: ${elapsed}s, remaining: ${remaining}s`);
      setTimeLeft(remaining);
      if (remaining === 0) setVotingEnded(true);
    });

    socket.on("votingResult", ({ votes, winningOption, winnerName }) => {
      console.log(`[SOCKET] votingResult received. Final votes: ${JSON.stringify(votes)}, Winner: ${winnerName}`);
      setPollData((prev) => ({
        ...prev,
        votes: votes,
      }));
      setVotingEnded(true);
      setWinnerName(winnerName);

      // Clear storage to reset for next poll
      localStorage.removeItem(userVoteKey);
      localStorage.removeItem(voteKey);
    });

    return () => {
      socket.off("timerStart");
      socket.off("votingResult");
    };
  }, [roomId, sceneId]);

  useEffect(() => {
    if (timeLeft <= 0 || votingEnded) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setVotingEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, votingEnded]);

  const handleVote = (index) => {
    const userName = localStorage.getItem("userName");

    if (pollData.voted || votingEnded) return;

    const updatedVotes = [...pollData.votes];
    updatedVotes[index] += 1;

    setPollData((prev) => ({
      ...prev,
      voted: true,
      userVoteIndex: index,
      votes: updatedVotes,
    }));

    localStorage.setItem(`${userName}-${roomId}-${sceneId}`, JSON.stringify({ optionIndex: index }));
    localStorage.setItem(`votes-${roomId}-${sceneId}`, JSON.stringify(updatedVotes));

    console.log(`[ACTION] Vote submitted for option ${index}`);
    socket.emit("submitVote", { roomId, sceneId, optionIndex: index });
  };

  return (
    <div className="poll-room-container">
      <h1 className="poll-title">{pollData.title}</h1>
      <p className="description-box">{pollData.description}</p>
      <p className="timer">
        {votingEnded ? "Voting ended" : `Time left: ${timeLeft}s`}
      </p>

      <div className="poll-options">
        {[0, 1].map((index) => (
          <div
            key={index}
            className={`poll-option ${
              votingEnded || pollData.voted ? "disabled" : ""
            } ${pollData.userVoteIndex === index ? "selected" : ""}`}
            style={{
              backgroundImage: `url(${pollData.images[index]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => handleVote(index)}
          >
            <div className="option-content">
              <p>{pollData.options[index]}</p>
              <span>{pollData.votes[index]} votes</span>
            </div>
          </div>
        ))}
      </div>

      {pollData.voted && <p className="voted-message">You've already voted!</p>}

      {votingEnded && (
        <div className="result-message">
          <h3>
            {pollData.votes[0] === pollData.votes[1]
              ? `It's a tie between ${pollData.options[0]} and ${pollData.options[1]}!`
              : `🏆 Winner: ${winnerName}`}
          </h3>
        </div>
      )}

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Login
      </button>
    </div>
  );
};

export default PollRoom;
