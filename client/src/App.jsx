import React, { useState, useEffect } from "react";
import socket from "./socket"; // Singleton socket instance

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    const messageData = {
      room,
      author: username,
      message,
      time: new Date(Date.now()).toLocaleTimeString(),
    };
    socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);
    setMessage("");
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Message received on frontend:", data);
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup listener
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="App">
      <h1>Socket.IO Chat</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages:</h3>
        {messageList.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>{msg.author}</strong> [{msg.time}]: {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
