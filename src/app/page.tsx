'use client';

import CodeEditor from "@/components/codeEditor";
import HistoryList from "@/components/HistoryList";
import { useState } from "react";
import SignUpPage from "./pages/sginup/page";
import LoginForm from "./pages/signin/page";
import { useUser } from "./context/userContext";
import Modal from "@/components/Modal"; 
import { FaRegUser } from "react-icons/fa";

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const { user, setUser } = useUser();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const handleRunAnalysis = async () => {
     console.log(user);
    if (!user) {
      setShowAuthModal(true);
      return;
    }
      console.log(language,code);
     
    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ code, language}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setResult(data.result);
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    setUser(null);
    window.location.reload();
  };

  return (
   <main className="px-4 py-6 max-w-7xl mx-auto">
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-3xl sm:text-4xl font-bold text-white">CodeMetric</h1>

    {user ? (
  <div className="flex items-center gap-3 text-sm text-white p-3 bg-gray-800 rounded-lg">
    <FaRegUser className="text-lg" />
    <div>
      <p>
        <span className="font-semibold">{user.email}</span>
      </p>
      <button
        onClick={handleLogout}
        className="mt-1 ml-8 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
      >
        Logout
      </button>
    </div>
  </div>
) : (
  <button
    onClick={() => {
      setShowAuthModal(true);
    }}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
  >
    Login / Sign Up
  </button>
)}

  </div>

  {/* Main Content Split Layout */}
  <div className="flex flex-col md:flex-row gap-6">
    {/* LEFT SIDE: Code Input & Results */}
    <div className="flex-1 w-1/2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <label className="text-white font-medium">Choose Language:</label>
        <select
          className="border p-2 rounded bg-white text-black w-full sm:w-auto"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="mb-4">
        <CodeEditor language={language} onCodeChange={setCode} />
      </div>

      <button
        className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleRunAnalysis}
      >
        Analyze
      </button>

      {result && (
        <div className="mt-6 p-6 border rounded-2xl shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📈 Analysis Result
          </h2>
          <div className="space-y-2 text-sm sm:text-base">
            <p>
              ⏱ <span className="font-semibold">Time Complexity:</span>{" "}
              <span className="text-blue-700">{result.time}</span>
            </p>
            <p>
              🧠 <span className="font-semibold">Space Complexity:</span>{" "}
              <span className="text-purple-700">{result.space}</span>
            </p>
            <p>
              🧾 <span className="font-semibold">Explanation:</span>{" "}
              <span className="text-gray-700">{result.explanation}</span>
            </p>
          </div>
        </div>
      )}
    </div>

    {/* RIGHT SIDE: History Panel */}
    {user && (
      <div className="w-full lg:w-[28rem]">
        <HistoryList />
      </div>
    )}
  </div>

  {/* Auth Modal */}
  {!user && showAuthModal && (
    <Modal onClose={() => setShowAuthModal(false)}>
      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => setShowLogin(true)}
          className={`px-4 py-2 rounded ${showLogin ? "bg-blue-600 text-white" : "bg-gray-500 text-white"}`}
        >
          Login
        </button>
        <button
          onClick={() => setShowLogin(false)}
          className={`px-4 py-2 rounded ${!showLogin ? "bg-blue-600 text-white" : "bg-gray-500 text-white"}`}
        >
          Sign Up
        </button>
      </div>
      {showLogin ? <LoginForm /> : <SignUpPage />}
    </Modal>
  )}
</main>

  );
}
