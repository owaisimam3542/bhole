import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
function App() {
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [kundliData, setKundliData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const exportKundliAsPDF = () => {
  const element = document.getElementById("kundli-section");
  const opt = {
    margin: 0.5,
    filename: `Kundli-${name || "Report"}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
};
  const handleGenerateKundli = async () => {
  if (!name || !dob || !tob || !pob) {
    alert("Please complete your profile first.");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post("https://api.bhole.ai/generate-kundli", {
      name,
      dob,
      tob,
      pob,
      language,
    });

    const data = res.data;
    setKundliData(data);
    const replyText = `Kundli generated for ${data.birth_details?.name || "user"}.`;
    setHistory([{ role: "bot", content: replyText }]);
    narrateResponse(replyText);

    const sessionId = Date.now();
    setChatSessions((prev) => [
      ...prev,
      {
        id: sessionId,
        feature: "🗺️ Generate My Kundli",
        messages: [{ role: "bot", content: replyText }],
        timestamp: new Date(),
      },
    ]);
    setCurrentSessionId(sessionId);
  } catch (err) {
    setKundliData(null);
    setHistory([{ role: "bot", content: "Failed to generate Kundli." }]);
  }
  setLoading(false);
};


  const handleSpiritualHabits = async () => {
    if (!name || !dob || !tob || !pob) {
      alert("Please complete your profile first.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post("https://api.bhole.ai/spiritual-habits", {
        name,
        dob,
        tob,
        pob,
        language
      });
  
      const habits = res.data.habits || [];
      setSpiritualHabits(habits);
      narrateResponse(habits.join(". "));
  
      const sessionId = Date.now();
      const replyText = habits.map(h => `• ${h}`).join("\n");
  
      const updatedSession = {
        id: sessionId,
        feature: "🧘 Spiritual Habit Tracker",
        messages: [{ role: "bot", content: replyText }],
        timestamp: new Date(),
      };
  
      setChatSessions((prev) => [...prev, updatedSession]);
      setCurrentSessionId(sessionId);
    } catch (e) {
      const fallback = "Something went wrong while fetching your spiritual habits.";
      setSpiritualHabits([fallback]);
  
      const sessionId = Date.now();
      const updatedSession = {
        id: sessionId,
        feature: "🧘 Spiritual Habit Tracker",
        messages: [{ role: "bot", content: fallback }],
        timestamp: new Date(),
      };
      setChatSessions((prev) => [...prev, updatedSession]);
      setCurrentSessionId(sessionId);
    }
  
    setLoading(false);
  };
  
  
  const handleFetchPastLife = async () => {
    if (!name || !dob || !tob || !pob) {
      alert("Please complete your profile first.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post("https://api.bhole.ai/past-life", {
        name,
        dob,
        tob,
        pob,
        language,
      });
  
      if (res.data.panels) {
        setKarmaPanels(res.data.panels);
        narrateResponse(res.data.panels.map(p => p.text).join(" "));
      } else {
        setKarmaPanels([{ text: res.data.reply }]);
      }
      const sessionId = Date.now();
      const replyText = res.data.panels ? res.data.panels.map(p => p.text).join("\n\n") : res.data.reply;
      const updatedSession = {
  id: sessionId,
  feature: "🕉️ Karma & Past Life Reading",
  messages: [{ role: "bot", content: replyText }],
  timestamp: new Date(),
};
setChatSessions((prev) => [...prev, updatedSession]);
setCurrentSessionId(sessionId);

    } catch (e) {
      setKarmaPanels([{ text: "Something went wrong while fetching your karmic report." }]);
    }

    setLoading(false);
  };
  const handleMatchCompatibility = async () => {
    if (!name || !dob || !tob || !pob || !partnerName) {
      alert("Please complete both your profile and partner's name.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await axios.post("https://api.bhole.ai/match", {
        name,
        dob,
        tob,
        pob,
        partner_name: partnerName,
        language,
      });
  
      setMatchReport(res.data);
      const sessionId = Date.now();
      const replyText = res.data?.summary || "Here is your compatibility analysis.";
      const updatedSession = {id: sessionId,
      feature: "💖 Matchmaking + Compatibility AI",
      messages: [{ role: "bot", content: replyText }],
      timestamp: new Date(),
      };
      setChatSessions((prev) => [...prev, updatedSession]);
      setCurrentSessionId(sessionId);

      narrateResponse(res.data?.summary || "Here is your compatibility analysis.");
    } catch (e) {
      setMatchReport({ summary: "Something went wrong while calculating compatibility." });
    }
    setLoading(false);
  };
  
  
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [language, setLanguage] = useState("");
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [partnerName, setPartnerName] = useState("");
  const [matchReport, setMatchReport] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState("💤 Dream Meaning");
  const [loading, setLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const chatEndRef = useRef(null);
  const [kundliFile, setKundliFile] = useState(null);
  const [karmaPanels, setKarmaPanels] = useState([]);
  const [spiritualHabits, setSpiritualHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState({});


  const handleKundliUpload = (file) => {
  setKundliFile(file);
};

  const handleLiveBirthDecode = async () => {
  if (!kundliFile && (!name || !dob || !tob || !pob)) {
    alert("Upload your Kundli PDF or complete your birth details.");
    return;
  }
  //  const handleFetchPastLife = async () => {
  //  if (!name || !dob || !tob || !pob) {
  //   alert("Please complete your profile first.");
  //   return;
  // }

  //  setLoading(true);
  //  try {
  //   const res = await axios.post("http://localhost:8000/past-life", {
  //     name,
  //     dob,
  //     tob,
  //     pob,
  //     language,
  //   });

  //   if (res.data.panels) {
  //     setKarmaPanels(res.data.panels);
  //     narrateResponse(res.data.panels.map(p => p.text).join(" "));
  //   } else {
  //     setKarmaPanels([{ text: res.data.reply }]);
  //   }
  // } catch (e) {
  //   setKarmaPanels([{ text: "Something went wrong while fetching your karmic report." }]);
  // }
  //  setLoading(false);
  // };


  const formData = new FormData();
  formData.append("feature", "🌌 Live Birth Chart Decoder");
  formData.append("language", language);
  if (kundliFile) {
    formData.append("file", kundliFile);
  } else {
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("tob", tob);
    formData.append("pob", pob);
  }

  setLoading(true);
  try {
    const res = await axios.post("https://api.bhole.ai/decode", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    const botReply = res.data.reply;
    setHistory([{ role: "bot", content: botReply }]);
    const sessionId = Date.now();
    const updatedSession = {
       id: sessionId,
       feature: "🌌 Live Birth Chart Decoder",
       messages: [{ role: "bot", content: botReply }],
       timestamp: new Date(),
      };
    setChatSessions((prev) => [...prev, updatedSession]);
    setCurrentSessionId(sessionId);

    narrateResponse(botReply);
  } catch (e) {
    setHistory([{ role: "bot", content: "Something went wrong during decoding." }]);
  }
  setLoading(false);
};



useEffect(() => {
  window.speechSynthesis.getVoices();
}, []);


const narrateResponse = (text) => {
  if (!('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;

  const waitForVoices = () =>
    new Promise(resolve => {
      let voices = synth.getVoices();
      if (voices.length) return resolve(voices);
      window.speechSynthesis.onvoiceschanged = () => resolve(synth.getVoices());
    });

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  const speakChunk = (chunk, voice) =>
    new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(chunk.trim());
      utterance.voice = voice;
      utterance.lang = voice?.lang || 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      utterance.volume = 1;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        resolve();
      };

      synth.speak(utterance);
    });

  const splitIntoChunks = (text) => {
    return text.match(/[^.!?]+[.!?]*/g) || [text];
  };

  const speakAllChunks = async (chunks, voice) => {
    for (const chunk of chunks) {
      if (chunk.trim()) {
        await speakChunk(chunk, voice);
        await sleep(250); // slight pause to prevent clipping
      }
    }
  };

  const start = async () => {
    const voices = await waitForVoices();
    let voice;

    if (language === "Hindi") {
      voice = voices.find(v => v.lang.toLowerCase().includes("hi"));
    } else {
      voice =
        voices.find(v => v.lang.toLowerCase().includes("en") && /male|david|fred|english/i.test(v.name)) ||
        voices.find(v => v.lang.toLowerCase().includes("en"));
    }

    synth.cancel(); // stop any previous narration

    const chunks = splitIntoChunks(text);
    await speakAllChunks(chunks, voice);
  };

  start();
};




  // const features = [
  //   "💤 Dream Meaning",
  //   "♈ My Zodiac Information",
  //   "🃏 Tarot Reading (Major Arcana)",
  //   "🔢 Numerology Reading",
  //   "🧭 Vocational Map",
  //   "🦉 Discover Your Power Animal",
  //   "📆 Daily Horoscope",
  //   "🌌 Live Birth Chart Decoder",
  //   "🕉️ Karma & Past Life Reading",
  //   "💖 Matchmaking + Compatibility AI",
  //   "🧘 Spiritual Habit Tracker",
  //   "🗺️ Generate My Kundli",
  //   "🗞️ Astrology + Current Affairs",
  //   "👤 My Profile", 
  //   "🚀 Upgrade to Premium"
  // ];
const features = [
  {
    label: "✨ Explore Bhole",
    subFeatures: [
      "💤 Dream Meaning",
      "🃏 Tarot Reading (Major Arcana)",
      "🧭 Vocational Map",
      "🦉 Discover Your Power Animal"
    ]
  },
  "♈ My Zodiac Information",
  "🔢 Numerology Reading",
  "📆 Daily Horoscope",
  "🌌 Live Birth Chart Decoder",
  "🕉️ Karma & Past Life Reading",
  "💖 Matchmaking + Compatibility AI",
  "🧘 Spiritual Habit Tracker",
  "🗺️ Generate My Kundli",
  "🗞️ Astrology + Current Affairs",
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
      const res = await axios.post("https://api.bhole.ai/chat", {
        name,
        dob,
        tob,
        pob,
        history: newHistory,
        feature: selectedFeature,
        language, // <-- pass language
      });

      const botReply = res.data.reply;
      const fullHistory = [...newHistory, { role: "bot", content: botReply }];
      setHistory(fullHistory);

      if (selectedFeature === "📆 Daily Horoscope" || selectedFeature === "♈ My Zodiac Information") {
        narrateResponse(botReply);
      }

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
    if (!name || !dob || !tob || !pob || !language) {
      alert("Please fill all profile fields.");
      return;
    }
    setProfileCompleted(true);
  };

  const handleRazorpayPayment = async () => {
    const res = await axios.post("https://api.bhole.ai/create-razorpay-order", {
      amount: 49900,
      currency: "INR"
    });

    const options = {
      key: "RAZORPAY_KEY_ID",
      amount: res.data.amount,
      currency: "INR",
      name: "Bhole.ai Premium",
      description: "Premium Upgrade",
      order_id: res.data.id,
      handler: function (response) {
        alert("✅ Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: name,
        email: "user@example.com",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaytmPayment = () => {
    alert("🔜 Redirecting to Paytm (integration pending).");
  };

  // if (!profileCompleted) {
  //   return (
  //     <div style={landingStyle}>
  //       <div style={landingBoxStyle}>
  //         <h1 style={{ marginBottom: "20px" }}>👤 Complete Your Profile</h1>
  //         <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
  //         <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={inputStyle} />
  //         <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} style={inputStyle} />
  //         <input placeholder="Place of Birth" value={pob} onChange={(e) => setPob(e.target.value)} style={inputStyle} />
  //         <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
  //            <option value="" disabled>
  //   Select Language
  // </option>
  //           <option value="English">English</option>
  //           <option value="Hindi">हिन्दी</option>
  //         </select>
  //         <button onClick={handleSaveProfile} style={{ ...buttonStyle, marginTop: "20px", backgroundColor: "#10b981", color: "#fff" }}>
  //           Get Started →
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

return (
  <div style={{ overflowX: "auto", width: "100vw", height: "100vh" }}>
    <div style={{ minWidth: "1280px" }}>
      <div style={mainStyle}>

      {/* <div style={{ display: "flex", gap: "20px" }}> */}
<div
  style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "20px",
  }}
>


        <div style={sidebarStyle}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>🔮 Bhole.ai</h2>
          {features.map((feature, index) => {
  if (typeof feature === "string") {
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
  } else {
    const isExpanded = expandedSection === feature.label;
    return (
      <div key={index}>
        <div
          onClick={() =>
            setExpandedSection(isExpanded ? null : feature.label)
          }
          style={{
            fontWeight: "bold",
            marginTop: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#333"
          }}
        >
          <span>{feature.label}</span>
          <span>{isExpanded ? "▼" : "▶"}</span>
        </div>

        {isExpanded &&
          feature.subFeatures.map((sub, subIndex) => {
            const isActive = sub === selectedFeature;
            return (
              <div
                key={subIndex}
                onClick={() => handleFeatureChange(sub)}
                style={{
                  padding: "10px 12px",
                  margin: "4px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  paddingLeft: "24px",
                  backgroundColor: isActive ? "#2563eb" : "transparent",
                  color: isActive ? "#fff" : "#333",
                  fontWeight: isActive ? "600" : "400",
                  transition: "all 0.2s ease"
                }}
              >
                {sub}
              </div>
            );
          })}
      </div>
      
    );
  }
})}


          {/* Optional Voice Preview Button */}
          <button onClick={() => narrateResponse("ॐ नमः शिवाय — I am Shiva, the eternal witness.")} style={{ ...buttonStyle, marginTop: "30px", backgroundColor: "#111", color: "#fff" }}>
            🔊 Preview Shiva Voice
          </button>
        </div>

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
              ):selectedFeature === "🌌 Live Birth Chart Decoder" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  <input
    type="file"
    accept=".pdf"
    onChange={(e) => handleKundliUpload(e.target.files[0])}
    style={inputStyle}
  />
  <button
    onClick={handleLiveBirthDecode}
    style={{ ...buttonStyle, backgroundColor: "#6d28d9", color: "#fff" }}
  >
    🔍 Decode My Birth Chart
  </button>

  {/* ✅ Display response if exists */}
  {history.length > 0 && (
    <div
      style={{
        marginTop: "20px",
        padding: "16px",
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        whiteSpace: "pre-wrap",
        color: "#111",
        lineHeight: "1.6",
      }}
    >
      {history[0].content}
    </div>
  )}
</div>
) : selectedFeature === "🕉️ Karma & Past Life Reading" ? (
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
    <button
      onClick={handleFetchPastLife}
      style={{ ...buttonStyle, backgroundColor: "#7c3aed", color: "#fff" }}
    >
      🔮 Reveal My Past Life Karma
    </button>

    {karmaPanels.length > 0 && (
      <div style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
        {karmaPanels.map((panel, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {panel.image && (
              <img
                src={panel.image}
                alt={`Scene ${i + 1}`}
                style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "12px" }}
              />
            )}
            <p style={{ fontSize: "16px", color: "#333", textAlign: "center" }}>
              {panel.text}
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
  ) : selectedFeature === "💖 Matchmaking + Compatibility AI" ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        placeholder="Your Partner's Name"
        value={partnerName}
        onChange={(e) => setPartnerName(e.target.value)}
        style={inputStyle}
      />
      <button
        onClick={handleMatchCompatibility}
        style={{ ...buttonStyle, backgroundColor: "#ec4899", color: "#fff" }}
      >
        💘 Check Compatibility
      </button>
  
      {matchReport && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "rgba(255,255,255,0.5)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            whiteSpace: "pre-wrap",
            color: "#111",
            lineHeight: "1.6",
          }}
        >
          <h3>💞 Compatibility Summary</h3>
          <p><strong>Love Score:</strong> {matchReport.love_score}</p>
          <p><strong>Conflict Potential:</strong> {matchReport.conflict_potential}</p>
          <p><strong>Lucky Dates:</strong> {matchReport.lucky_dates}</p>
          <p><strong>Astro Dating Tip:</strong> {matchReport.dating_tip}</p>
          <p style={{ marginTop: "10px" }}>{matchReport.summary}</p>
        </div>
      )}
    </div>
  ) : selectedFeature === "🧘 Spiritual Habit Tracker" ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <button
    onClick={handleSpiritualHabits}
    style={{ ...buttonStyle, backgroundColor: "#0f766e", color: "#fff" }}
  >
    🧘 Get My Spiritual Routine
  </button>

  {spiritualHabits.length > 0 && (
    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {spiritualHabits.map((habit, i) => (
        <label key={i} style={{ background: "#fff", padding: "10px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <input
            type="checkbox"
            checked={!!completedHabits[i]}
            onChange={() => setCompletedHabits(prev => ({ ...prev, [i]: !prev[i] }))}
            style={{ marginRight: "10px" }}
          />
          {habit}
        </label>
      ))}
    </div>
  )}
</div>
):selectedFeature === "🗺️ Generate My Kundli" ? (
  <div style={{ padding: "20px" }}>
    <button
      onClick={handleGenerateKundli}
      style={{ ...buttonStyle, backgroundColor: "#9333ea", color: "#fff" }}
    >
      🗺️ Generate Kundli Report
    </button>

    {kundliData && (
      <div id="kundli-section" style={{ padding: "20px", lineHeight: "1.7", color: "#222" }}>
        <h2>📜 Birth Details</h2>
        <ul>
          {Object.entries(kundliData.birth_details || {}).map(([key, val]) => (
            <li key={key}><strong>{key}:</strong> {val}</li>
          ))}
        </ul>

        <h2>🪐 Planetary Positions</h2>
        <ul>
          {kundliData.planetary_positions?.map((p, i) => (
            <li key={i}>
              <strong>{p.planet}:</strong> {p.sign} {p.degree} – {p.nakshatra} Pada {p.pada}
            </li>
          ))}
        </ul>

        <h2>📊 Charts</h2>
        {Object.entries(kundliData.charts || {}).map(([chart, placements]) => (
          <div key={chart}>
            <strong>{chart.replace("_", " ").toUpperCase()}</strong>
            <ul>
              {placements.map((pos, idx) => <li key={idx}>{pos}</li>)}
            </ul>
          </div>
        ))}

        <h2>🔭 Vimshottari Dasha</h2>
        <ul>
          {kundliData.dashas?.vimshottari?.map((d, i) => (
            <li key={i}>{d.period}: {d.start} to {d.end}</li>
          ))}
        </ul>

        <h2>🧘 Important Yogas</h2>
        <ul>
          {kundliData.yogas?.map((yoga, idx) => (
            <li key={idx}>{yoga}</li>
          ))}
        </ul>

        <h2>🌟 Ashtakvarga</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {Object.entries(kundliData.ashtakvarga || {}).map(([key, val]) =>
            `${key.toUpperCase()}: ${JSON.stringify(val)}\n`
          )}
        </pre>

        <h2>💪 Shadbala</h2>
        <ul>
          {Object.entries(kundliData.shadbala || {}).map(([planet, strength]) => (
            <li key={planet}><strong>{planet}:</strong> {strength}</li>
          ))}
        </ul>
            <button
  onClick={exportKundliAsPDF}
  style={{ ...buttonStyle, backgroundColor: "#2563eb", color: "#fff", marginTop: "20px" }}
>
  📄 Download Kundli as PDF
</button>
      </div>
      
    )}
    
  </div>







):selectedFeature === "🗞️ Astrology + Current Affairs" ? (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    <button
      onClick={() => sendMessage("Tell me the current astrological situation")}
      style={{ ...buttonStyle, backgroundColor: "#f59e0b", color: "#fff" }}
    >
      🪐 What’s Happening Now in the Sky?
    </button>

    {history.length > 0 && (
      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          backgroundColor: "rgba(255,255,255,0.5)",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          whiteSpace: "pre-wrap",
          color: "#111",
          lineHeight: "1.6",
        }}
      >
        {history[history.length - 1].content}
      </div>
    )}
  </div>





            ) : selectedFeature === "🚀 Upgrade to Premium" ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h3>🚀 Unlock Premium Features</h3>
                <p>Enjoy advanced astrology insights, personalized forecasts, and exclusive content.</p>
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "20px" }}>
                  <button onClick={handleRazorpayPayment} style={{ ...buttonStyle, backgroundColor: "#2563eb", color: "#fff" }}>
                    Pay with Razorpay
                  </button>
                  <button onClick={handlePaytmPayment} style={{ ...buttonStyle, backgroundColor: "#00bfa5", color: "#fff" }}>
                    Pay with Paytm
                  </button>
                </div>
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
                    style={{ ...buttonStyle, backgroundColor: "#2563eb", color: "#fff", borderColor: "#2563eb", padding: "12px 18px" }}
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
                              {msg.content.split("\n").map((line, i) =>
                                line.trim() ? <li key={i}>{line.trim()}</li> : null
                              )}
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
        </div>
  </div>
  );
}

// Styles (unchanged)
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
const sidebarStyle = { width: "240px" };
const rightSidebarStyle = { width: "240px" };
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
