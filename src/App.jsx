import "./App.css";
import { useState, useEffect, useRef } from "react";

import moon144 from "./assets/moon.144.jpg";
import moon240 from "./assets/moon.240.jpg";
import moon480 from "./assets/moon.480.jpg";
import moon720 from "./assets/moon.720.jpg";

import audioMoon from "./assets/one.mp3";
import audioReality from "./assets/two.mp3";
function Stars() {
  const stars = Array.from({ length: 200 });

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((_, i) => {
        const size = Math.random() * 3 + 1;

        return (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: size + "px",
              height: size + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random(),
            }}
          />
        );
      })}
    </div>
  );
}

function App() {
  const [resolution, setResolution] = useState("144");

  const [hasPermission, setHasPermission] = useState(false);

  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);

  const audioRef = useRef(null); // ⭐ NEW

  const moonMap = {
    144: moon144,
    240: moon240,
    480: moon480,
    720: moon720,
  };

  // CAMERA PERMISSION
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })

      .then((mediaStream) => {
        setHasPermission(true);

        setStream(mediaStream);
      })

      .catch(() => {
        setHasPermission(false);
      });
  }, []);

  // ATTACH STREAM TO VIDEO
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, resolution]);

  // ⭐ NEW: AUDIO SWITCHING
  // ⭐ FIXED AUDIO LOGIC
  useEffect(() => {
    if (!audioRef.current) return;

    const currentSrc = audioRef.current.src;

    // if entering reality mode
    if (resolution === "1080") {
      if (!currentSrc.includes("two.mp3")) {
        audioRef.current.src = audioReality;

        audioRef.current.play().catch(() => {});
      }
    }

    // if leaving reality mode
    else {
      if (!currentSrc.includes("one.mp3")) {
        audioRef.current.src = audioMoon;

        audioRef.current.play().catch(() => {});
      }
    }
  }, [resolution]);
  // PERMISSION BLOCK
  if (!hasPermission) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black flex justify-center items-center text-white text-2xl">
        Grant Camera Permission
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black flex flex-col justify-center items-center gap-6">
      {/* VIDEO OR IMAGE */}
      <Stars />
      <div className="bg-black w-[40vw] h-[50vh] flex justify-center items-center z-10">
        {resolution === "1080" ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-[80%] h-[80%] object-contain"
          />
        ) : (
          <img
            src={moonMap[resolution]}
            alt="moon"
            className="w-[80%] h-[80%] object-contain"
          />
        )}
      </div>

      {/* SELECT */}

      <select
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5 z-10"
      >
        <option value="144">144p</option>
        <option value="240">240p</option>
        <option value="480">480p</option>
        <option value="720">720p</option>
        <option value="1080">1080p</option>
      </select>

      {/* ⭐ NEW: AUDIO ELEMENT */}

      <audio ref={audioRef} loop />
    </div>
  );
}

export default App;
