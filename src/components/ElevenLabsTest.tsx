"use client";

import React, { useState } from 'react';

export default function ElevenLabsTest() {
  const [text, setText] = useState('Welcome to Katyaayani Astrology. How can I help you today?');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async () => {
    setLoading(true);
    setAudioUrl(null);
    try {
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      console.error(error);
      alert('Error generating audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800">ElevenLabs Audio Test</h2>
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
      />
      <button
        onClick={generateAudio}
        disabled={loading || !text}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Generating...' : 'Generate Audio'}
      </button>
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
