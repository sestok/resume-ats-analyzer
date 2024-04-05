import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const [matchPercentage, setMatchPercentage] = useState(0);

  useEffect(() => {
    // Update the match percentage whenever matchedKeywords or totalWords changes
    if (totalWords > 0) {
      setMatchPercentage(((matchedKeywords.length / totalWords) * 100).toFixed(2));
    }
  }, [matchedKeywords, totalWords]);

  // Update totalWords when job description changes
  useEffect(() => {
    const words = jobDescription.trim().split(/\s+/);
    setTotalWords(words.length);
  }, [jobDescription]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert('Please upload a resume');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDescription);

    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setMatchedKeywords(data.matched_keywords);
  };

  return (
    <div className="App" style={{ backgroundColor: '#112D7C' }}>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-left text-blue-600 mb-6">Resume Feedback Tool</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">
                Job Description:
              </label>
              <textarea
                className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700">
                Upload Resume (PDF):
              </label>
              <input
                className="w-full p-4 text-sm border-2 border-gray-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-blue-500 focus:border-blue-500"
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                required
              />
            </div>
            <button type="submit" className="w-full py-3 px-4 text-sm text-white font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Submit
            </button>
          </form>
          </div>
      {/* Results and percentage display */}
      {matchedKeywords.length > 0 && (
        <div className="flex w-full max-w-4xl mx-auto mt-5 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Matched Keywords Column */}
          <div className="w-1/2 p-5">
            <h3 className="text-lg font-semibold text-left">Matched Keywords:</h3>
            <div className="text-left">
              {matchedKeywords.join(' · ')}
            </div>
          </div>

      {/* Match Percentage Column */}
      <div className="w-1/2 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">
                Your chances are: {matchPercentage}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default App;
