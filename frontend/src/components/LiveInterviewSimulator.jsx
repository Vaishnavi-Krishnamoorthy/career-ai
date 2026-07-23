import { useState, useEffect, useRef, useMemo } from 'react';
import { evaluateInterview } from '../services/api';

export default function LiveInterviewSimulator({ targetRole, experienceLevel, questions, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  
  // Evaluation state
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentQ = useMemo(() => {
    return questions[currentIdx] || {
      id: 1,
      category: 'System Design',
      question: 'How would you design a scalable backend service using async processing?',
      key_concepts: ['Async/Await', 'Caching', 'Load Balancing']
    };
  }, [questions, currentIdx]);

  // Setup WebCam stream
  useEffect(() => {
    let activeStream = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          activeStream = stream;
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.warn('Webcam stream notice:', err);
        setIsCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Speak AI Question via Text-to-Speech
  const speakQuestion = (text) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Speak question when currentIdx changes
  useEffect(() => {
    if (currentQ && currentQ.question) {
      speakQuestion(currentQ.question);
    }
  }, [currentIdx, currentQ]);

  // Speech-to-Text Recognition setup
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser version. You can type your answer below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentSpokenText(prev => {
          const combined = (prev ? prev + ' ' : '') + transcript;
          return combined;
        });
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech recognition error:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraActive(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const handleNext = () => {
    stopListening();
    const updatedAnswers = { ...answers, [currentQ.id]: currentSpokenText };
    setAnswers(updatedAnswers);

    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextQ = questions[nextIdx];
      setCurrentSpokenText(updatedAnswers[nextQ?.id] || '');
      setCurrentIdx(nextIdx);
    } else {
      finishInterview(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    stopListening();
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      const prevQ = questions[prevIdx];
      setCurrentSpokenText(answers[prevQ?.id] || '');
      setCurrentIdx(prevIdx);
    }
  };

  const finishInterview = async (finalAnswers) => {
    setEvaluating(true);

    const qaPairs = questions.map(q => ({
      question_id: q.id,
      question: q.question,
      category: q.category,
      spoken_answer: finalAnswers[q.id] || currentSpokenText || 'No verbal answer recorded.'
    }));

    try {
      const res = await evaluateInterview(targetRole, experienceLevel, qaPairs);
      setEvaluation(res);
    } catch (err) {
      console.error('Evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="live-simulator-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="badge badge-emerald" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
            🔴 LIVE INTERVIEW ROOM
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
            AI Mock Interview & Evaluation: <span className="gradient-text">{targetRole}</span>
          </h3>
        </div>

        <button onClick={onBack} className="btn-outline" style={{ fontSize: '0.85rem' }}>
          ✕ Exit Simulator
        </button>
      </div>

      {/* Main Interview Studio Layout */}
      {!evaluation && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left: WebCam Camera Box */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6ee7b7' }}>
                  🎥 Candidate Live Video Feed
                </span>
                <span className={`badge ${isCameraActive ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.75rem' }}>
                  {isCameraActive ? 'Camera ON' : 'Camera OFF'}
                </span>
              </div>

              {/* Video Element Container */}
              <div style={{
                width: '100%',
                height: '260px',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#090d16',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-glass)'
              }}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: isCameraActive ? 'block' : 'none'
                  }}
                />
                {!isCameraActive && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '2.5rem' }}>📷</span>
                    <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Camera is OFF or Unavailable</p>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  {isListening && (
                    <span className="badge badge-rose animate-pulse" style={{ fontSize: '0.75rem' }}>
                      🎙️ Listening to Answer...
                    </span>
                  )}
                  {isSpeakingQuestion && (
                    <span className="badge badge-cyan animate-pulse" style={{ fontSize: '0.75rem' }}>
                      🔊 AI Speaking...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Media Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={toggleCamera}
                className={isCameraActive ? 'btn-secondary' : 'btn-outline'}
                style={{ fontSize: '0.85rem' }}
              >
                {isCameraActive ? '📷 Turn Off Camera' : '📷 Turn On Camera'}
              </button>
              <button
                type="button"
                onClick={toggleMic}
                className={isMicMuted ? 'btn-outline' : 'btn-secondary'}
                style={{ fontSize: '0.85rem' }}
              >
                {isMicMuted ? '🎙️ Unmute Mic' : '🎙️ Mute Mic'}
              </button>
            </div>
          </div>

          {/* Right: AI Question & Candidate Answer Box */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-indigo">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="badge badge-cyan" style={{ fontSize: '0.8rem' }}>
                  {currentQ.category}
                </span>
              </div>

              {/* Question Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border-glass)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '700', lineHeight: 1.5, color: '#f8fafc', marginBottom: '10px' }}>
                    {currentQ.question}
                  </h4>
                  <button
                    onClick={() => speakQuestion(currentQ.question)}
                    style={{ background: 'transparent', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Read Question Out Loud"
                  >
                    🔊
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(currentQ.key_concepts || []).map((concept, idx) => (
                    <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', color: '#94a3b8' }}>
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spoken Answer Transcription Box */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    Your Spoken Response (Speech-to-Text Transcribed):
                  </label>
                  {!isListening ? (
                    <button onClick={startListening} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      🎙️ Start Speaking
                    </button>
                  ) : (
                    <button onClick={stopListening} className="btn-primary" style={{ fontSize: '0.75rem', padding: '4px 10px', background: '#ef4444' }}>
                      ⏹ Stop Listening
                    </button>
                  )}
                </div>

                <textarea
                  rows={5}
                  value={currentSpokenText}
                  onChange={(e) => setCurrentSpokenText(e.target.value)}
                  placeholder="Click 'Start Speaking' and answer out loud on camera, or type your answer here..."
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid var(--border-glass)',
                    padding: '12px',
                    borderRadius: '10px',
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'inherit',
                    fontSize: '0.92rem',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            </div>

            {/* Navigation & Submit Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
              <button
                disabled={currentIdx === 0}
                onClick={handlePrevious}
                className="btn-outline"
                style={{ fontSize: '0.85rem' }}
              >
                ← Previous
              </button>

              <button
                onClick={handleNext}
                className="btn-primary"
                disabled={evaluating}
                style={{ fontSize: '0.95rem', padding: '10px 20px' }}
              >
                {evaluating
                  ? '⚡ Analyzing Interview with AI...'
                  : currentIdx < questions.length - 1
                  ? 'Next Question ➔'
                  : '🏁 Finish & Generate AI Evaluation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Evaluation Scorecard View */}
      {evaluation && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          
          <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px', marginBottom: '24px', textAlign: 'center' }}>
            <span className="badge badge-emerald" style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
              🎯 AI Performance Evaluation Complete
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>
              Interview Scorecard: <span className="gradient-text">{targetRole}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
              {evaluation.detailed_feedback}
            </p>
          </div>

          {/* Rating Scores Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Overall Performance</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#6ee7b7' }}>{evaluation.overall_score}%</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Technical Depth</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#a5b4fc' }}>{evaluation.technical_depth_rating}%</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Communication Clarity</div>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#38bdf8' }}>{evaluation.communication_clarity_rating}%</div>
            </div>
          </div>

          {/* Pros, Cons & Improvements Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            
            {/* Pros / Strengths */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h4 style={{ color: '#6ee7b7', fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ Key Strengths & Pros ({evaluation.pros?.length || 0})
              </h4>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7' }}>
                {(evaluation.pros || []).map((pro, pIdx) => (
                  <li key={pIdx} style={{ marginBottom: '8px' }}>{pro}</li>
                ))}
              </ul>
            </div>

            {/* Cons / Weaknesses */}
            <div style={{ background: 'rgba(244, 114, 182, 0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(244, 114, 182, 0.2)' }}>
              <h4 style={{ color: '#f472b6', fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Cons & Areas of Friction ({evaluation.cons?.length || 0})
              </h4>
              <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7' }}>
                {(evaluation.cons || []).map((con, cIdx) => (
                  <li key={cIdx} style={{ marginBottom: '8px' }}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Areas to Improve */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '32px' }}>
            <h4 style={{ color: '#fcd34d', fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px' }}>
              💡 Actionable Recommendations & Areas for Improvement
            </h4>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '20px' }}>
              {(evaluation.areas_for_improvement || []).map((item, iIdx) => (
                <li key={iIdx} style={{ marginBottom: '8px' }}>🚀 {item}</li>
              ))}
            </ul>

            <h5 style={{ fontSize: '0.9rem', color: '#a5b4fc', fontWeight: '700', marginBottom: '8px' }}>Recommended Study Topics:</h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(evaluation.recommended_topics || []).map((topic, tIdx) => (
                <span key={tIdx} className="badge badge-indigo">{topic}</span>
              ))}
            </div>
          </div>

          <div style={{ textAlignment: 'center', display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button onClick={() => { setEvaluation(null); setCurrentIdx(0); setAnswers({}); }} className="btn-primary" style={{ padding: '12px 24px' }}>
              🔄 Start New Practice Session
            </button>
            <button onClick={onBack} className="btn-secondary" style={{ padding: '12px 24px' }}>
              ← Return to Interview Hub
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
