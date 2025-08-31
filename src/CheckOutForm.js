import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState("💤 Dream Meaning");
  const [loading, setLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const features = [
    "💤 Dream Meaning",
    "♈ My Zodiac Information",
    "🃏 Tarot Reading (Major Arcana)",
    "🔢 Numerology Reading",
    "🧭 Vocational Map",
    "🦉 Discover Your Power Animal",
    "📆 Daily Horoscope",
    "👤 My Profile",
    "🚀 Upgrade to Premium"
  ];

  const quickQuestions = [
    { label: "🃏 Tarot", text: "Tell me my tarot reading" },
    { label: "♓ Horoscope", text: "Give me today's horoscope" },
    { label: "📆 Daily", text: "What is my daily horoscope?" },
    { label: "🔢 Numerology", text: "What does my birth number say about me?" },
  ];

  const sendMessage = async (customQuestion = null) => {
    const msg = customQuestion || question;
    if (!msg || !name || !dob || !tob || !pob) {
      alert("Please complete your profile first.");
      return;
    }

    const newHistory = [...history, { role: "user", content: msg }];
    setHistory(newHistory);
    setQuestion("");
    setLoading(true);

    const sessionId = currentSessionId || Date.now();

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        name,
        dob,
        tob,
        pob,
        history: newHistory,
        feature: selectedFeature,
      });

      const fullHistory = [...newHistory, { role: "bot", content: res.data.reply }];
      setHistory(fullHistory);

      const updatedSession = {
        id: sessionId,
        feature: selectedFeature,
        messages: fullHistory,
        timestamp: new Date(),
      };

      setChatSessions((prev) => {
        const existing = prev.filter((s) => s.id !== sessionId);
        return [...existing, updatedSession];
      });

      setCurrentSessionId(sessionId);
    } catch (err) {
      setHistory([...newHistory, { role: "bot", content: "Something went wrong." }]);
    }

    setLoading(false);
  };

  const handleFeatureChange = (feature) => {
    setSelectedFeature(feature);
    setHistory([]);
    setQuestion("");
    setCurrentSessionId(null);
  };

  const handleSaveProfile = () => {
    if (!name || !dob || !tob || !pob) {
      alert("Please fill all profile fields.");
      return;
    }
    setProfileCompleted(true);
  };

  if (!profileCompleted) {
    return (
      <div style={landingStyle}>
        <div style={landingBoxStyle}>
          <h1 style={{ marginBottom: "20px" }}>👤 Complete Your Profile</h1>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />
          <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} style={inputStyle} />
          <input placeholder="Place of Birth" value={pob} onChange={(e) => setPob(e.target.value)} style={inputStyle} />
          <button onClick={handleSaveProfile} style={{ ...buttonStyle, marginTop: "20px", backgroundColor: "#10b981", color: "#fff" }}>
            Get Started ->
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={mainStyle}>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Sidebar */}
        <div style={sidebarStyle}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>🔮 Bhole.ai</h2>
          {features.map((feature, index) => {
            const isActive = feature === selectedFeature;
            const isHovered = hoveredBtn === index;
            return (
              <div
                key={index}
                onClick={() => handleFeatureChange(feature)}
                onMouseEnter={() => setHoveredBtn(index)}
                onMouseLeave={() => setHoveredBtn(null)}
                style={{
                  padding: "12px",
                  margin: "8px 0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor: isActive || isHovered ? "#2563eb" : "transparent",
                  color: isActive || isHovered ? "#fff" : "#333",
                  fontWeight: isActive ? "600" : "400",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {feature}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={glassStyle}>
            <h2 style={{ marginBottom: "20px" }}>{selectedFeature}</h2>

            {selectedFeature === "👤 My Profile" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />
                <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} style={inputStyle} />
                <input placeholder="Place of Birth" value={pob} onChange={(e) => setPob(e.target.value)} style={inputStyle} />
                <button onClick={handleSaveProfile} style={{ ...buttonStyle, backgroundColor: "#10b981", color: "#fff" }}>
                  Save Me
                </button>
              </div>
            ) : selectedFeature === "🚀 Upgrade to Premium" ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h3>🚀 Unlock Premium Features</h3>
                <p>Enjoy advanced astrology insights, personalized forecasts, and exclusive content.</p>
                <button style={{ ...buttonStyle, backgroundColor: "#f59e0b", color: "#fff" }}>Upgrade Now</button>
              </div>
            ) : (
              <>
                {name && dob && tob && pob && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q.text)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: i === 0 ? "lightgreen" : i === 1 ? "lightyellow" : i === 2 ? "#fcd34d" : "lightpink",
                          color: "black",
                          borderColor: "#ccc",
                          opacity: 0.7,
                        }}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                  <input
                    type="text"
                    placeholder={`Ask about ${selectedFeature}...`}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      borderColor: "#2563eb",
                      padding: "12px 18px",
                    }}
                  >
                    Ask me
                  </button>
                </div>

                <div style={chatBoxStyle}>
                  {history.map((msg, i) => (
                    <div key={i} style={{ marginBottom: "12px", alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div
                        style={{
                          backgroundColor: msg.role === "user" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)",
                          color: "#000",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          maxWidth: "80%",
                          backdropFilter: "blur(8px)",
                          whiteSpace: "pre-wrap",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      >
                        <strong>{msg.role === "user" ? "You" : "Bhole.ai"}:</strong>
                        <div style={{ marginTop: "5px" }}>
                          {msg.role === "bot" ? (
                            <ul style={{ paddingLeft: "20px", margin: 0 }}>
                              {msg.content.split("\n").map((line, i) => line.trim() ? <li key={i}>{line.trim()}</li> : null)}
                            </ul>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && <div style={{ color: "#888" }}>Astrologer is typing...</div>}
                  <div ref={chatEndRef} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat History */}
        <div style={rightSidebarStyle}>
          <h3 style={{ marginBottom: "10px" }}>🕒 Chat History</h3>
          {chatSessions
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedFeature(session.feature);
                  setHistory(session.messages);
                  setCurrentSessionId(session.id);
                }}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div><strong>{session.feature}</strong></div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {new Date(session.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Styles
const landingStyle = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(to right, #e0eafc, #cfdef3)",
};

const landingBoxStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "100%",
  maxWidth: "400px",
};

const mainStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f4f7fb, #e7edf5)",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  padding: "20px",
  color: "#333",
};

const glassStyle = {
  background: "rgba(255, 255, 255, 0.15)",
  borderRadius: "20px",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  padding: "30px",
  color: "#111",
};

const sidebarStyle = {
  width: "240px",
};

const rightSidebarStyle = {
  width: "240px",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid transparent",
  fontSize: "16px",
  cursor: "pointer",
};

const chatBoxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  height: "400px",
  overflowY: "auto",
  padding: "10px",
};

export default App;
