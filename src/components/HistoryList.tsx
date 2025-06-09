'use client';

import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Analysis = {
  _id: string;
  language: string;
  timeComplexity: string;
  spaceComplexity: string;
  createdAt: string;
  code: string;
};

const HistoryList = () => {
  const [data, setData] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(() => {
        setIsAuthenticated(true);
        return fetch("/api/history", { credentials: "include" });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then((res: Analysis[]) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.message === "Not authenticated") {
          setIsAuthenticated(false);
        } else {
          setError("Unable to fetch history.");
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-500">Loading history...</p>;

  if (!isAuthenticated) {
    return <p className="text-gray-500 italic">Please log in to view history.</p>;
  }

  return (
    <div className="mt-6 border rounded-2xl p-6 shadow-lg bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
        📊 Recent Analyses
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((entry) => (
            <li
              key={entry._id}
              className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition duration-200"
            >
              <div className="text-xs text-gray-400 mb-1">
                🕒 {new Date(entry.createdAt).toLocaleString()}
              </div>
              <div className="text-base font-semibold text-gray-700 mb-1 capitalize">
                Language: {entry.language}
              </div>
              <div className="text-sm text-gray-600 flex flex-wrap gap-4 mb-2">
                <span>⏱ <strong>Time:</strong> {entry.timeComplexity}</span>
                <span><strong>Space:</strong> {entry.spaceComplexity}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCode(entry.code);
                  setSelectedLanguage(entry.language.toLowerCase());
                }}
                className="text-blue-600 underline text-sm"
              >
                View Code
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">Nothing yet</p>
      )}

      {/* Modal for viewing code */}
      {selectedCode && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full rounded-lg p-6 shadow-lg relative">
            <button
              onClick={() => setSelectedCode(null)}
              className="absolute top-2 right-4 text-gray-600 hover:text-black text-lg"
            >
              ✖
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Submitted Code</h3>
            <div className="max-h-[60vh] overflow-y-auto border rounded-lg">
              <SyntaxHighlighter language={selectedLanguage} style={dracula} wrapLongLines>
                {selectedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
