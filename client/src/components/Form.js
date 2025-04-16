import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const checkRoomCreationCooldown = (roomId) => {
    const lastCreatedTime = localStorage.getItem(`roomCreated-${roomId}`);
    if (lastCreatedTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastCreatedTime;
      return timeElapsed < 60000; // 60 seconds cooldown
    }
    return false;
  };

  const handleSubmit = (action) => {
    if (!name || !roomNumber) {
      setErrorMessage("Please enter both name and room number.");
      return;
    }

    setErrorMessage("");

    if (action === "create") {
      if (checkRoomCreationCooldown(roomNumber)) {
        setErrorMessage("You can only create a room once every 60 seconds.");
        return;
      }

      // Store the creation time in localStorage to prevent room creation for the next 60 seconds
      localStorage.setItem(`roomCreated-${roomNumber}`, Date.now());

      // Proceed with creating the room
      localStorage.setItem("userName", name);
      navigate(`/scenery/${roomNumber}`);
    } else {
      // Proceed with joining the room
      localStorage.setItem("userName", name);
      navigate(`/scenery/${roomNumber}`);
    }
  };

  return (
    <div className="form-container">
      <h1>Create or Join Room</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div className="form-group">
        <label>Room Number</label>
        <input
          type="text"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          placeholder="Enter room number"
        />
      </div>

      <div className="button-group">
        <button onClick={() => handleSubmit("create")} disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Room"}
        </button>
        <button onClick={() => handleSubmit("join")} disabled={isCreating}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Form;
