"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function Home() {
  const [mode, setMode] = useState<"home" | "academic" | "language">("home");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("Tamil");
  const [level, setLevel] = useState("Beginner");
  const [languageMode, setLanguageMode] = useState("Learn");

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function solveQuestion() {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnswer(data.error || "Something went wrong.");
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Could not connect to the AI.");
    } finally {
      setLoading(false);
    }
  }

  async function startLearning() {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          level,
          mode: languageMode,
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnswer(data.error || "Something went wrong.");
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Could not connect to the language tutor.");
    } finally {
      setLoading(false);
    }
  }

  function goToMode(newMode: "home" | "academic" | "language") {
    setMode(newMode);
    setQuestion("");
    setAnswer("");
  }

  return (
    <main className="appShell">
      {/* SIDEBAR */}

      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebarTop">
        <button
          className="brand"
          onClick={() => goToMode("home")}
          title="GyaanSetu"
        >
          <span className="brandIcon">🎓</span>
          {sidebarOpen && (
            <span className="brandText">GyaanSetu</span>
          )}
        </button>

        <button
          className="collapseButton"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "Collapse <" : ">"}
        </button>
        </div>

        <div className="sidebarNav">
          <button
            className={`sidebarButton ${
              mode === "home" ? "active" : ""
            }`}
            onClick={() => goToMode("home")}
            title="Home"
          >
            <span className="sidebarIcon">🏠</span>

            {sidebarOpen && <span>Home</span>}
          </button>

          <button
            className={`sidebarButton ${
              mode === "academic" ? "active" : ""
            }`}
            onClick={() => goToMode("academic")}
            title="Academic Tutor"
          >
            <span className="sidebarIcon">📚</span>

            {sidebarOpen && <span>Academic</span>}
          </button>

          <button
            className={`sidebarButton ${
              mode === "language" ? "active" : ""
            }`}
            onClick={() => goToMode("language")}
            title="Language Tutor"
          >
            <span className="sidebarIcon">🌍</span>

            {sidebarOpen && <span>Language</span>}
          </button>
        </div>

        <div className="sidebarBottom">
          {sidebarOpen && (
            <p>GyaanSetu</p>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <section className="mainContent">

        {/* HOME */}

        {mode === "home" && (
          <section className="homePage">
            <div className="homeContent">
              <p className="eyebrow">AI-POWERED LEARNING</p>

              <h1>
                Learn smarter with
                <span> GyaanSetu</span>
              </h1>

              <p className="heroText">
                Your personal AI learning assistant for academic
                problem solving and language learning.
              </p>

              <div className="featureGrid">
                <button
                  className="featureCard"
                  onClick={() => goToMode("academic")}
                >
                  <div className="icon">📚</div>

                  <h2>Academic Tutor</h2>

                  <p>
                    Solve and understand questions from mathematics,
                    physics, engineering and computer science.
                  </p>

                  <span className="cardLink">
                    Start solving →
                  </span>
                </button>

                <button
                  className="featureCard"
                  onClick={() => goToMode("language")}
                >
                  <div className="icon">🌍</div>

                  <h2>Language Tutor</h2>

                  <p>
                    Learn languages through vocabulary, practice,
                    conversation and quizzes.
                  </p>

                  <span className="cardLink">
                    Start learning →
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ACADEMIC TUTOR */}

        {mode === "academic" && (
          <section className="chatPage">
            <div className="chatHeader">
              <div>
                <p className="eyebrow">ACADEMIC LEARNING</p>

                <h1>📚 Academic Tutor</h1>

                <p>
                  Ask questions from mathematics, physics,
                  engineering, programming and other subjects.
                </p>
              </div>
            </div>

            <div className="chatWorkspace">
              {answer && (
                <div className="answerBox">
                  <h2>AI Tutor</h2>

                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>
              )}

              <div className="inputArea">
                <textarea
                  className="questionBox"
                  placeholder="Ask anything about your studies..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                <div className="inputBottom">
                  <div className="uploadBox">
                    <span>🖼️</span>

                    <div>
                      <strong>Upload question</strong>
                      <p>PNG, JPG, JPEG or WEBP</p>
                    </div>

                    <input type="file" accept="image/*" />
                  </div>

                  <button
                    className="primaryButton"
                    onClick={solveQuestion}
                    disabled={loading}
                  >
                    {loading ? "⏳ Solving..." : "✨ Solve"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LANGUAGE TUTOR */}

        {mode === "language" && (
          <section className="chatPage">
            <div className="chatHeader">
              <div>
                <p className="eyebrow">LANGUAGE LEARNING</p>

                <h1>🌍 Language Tutor</h1>

                <p>
                  Learn vocabulary, grammar, pronunciation and
                  conversation with your AI tutor.
                </p>
              </div>
            </div>

            <div className="chatWorkspace">
              {answer && (
                <div className="answerBox">
                  <h2>AI Tutor</h2>

                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>
              )}

              <div className="inputArea">
                <div className="selectRow">
                  <select
                    className="selectBox"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option>Tamil</option>
                    <option>Marathi</option>
                    <option>Telugu</option>
                    <option>Hindi</option>
                    <option>Kannada</option>
                    <option>Bengali</option>
                    <option>Other</option>
                  </select>

                  <select
                    className="selectBox"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Elementary</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="modeButtons">
                  <button
                    className={
                      languageMode === "Learn"
                        ? "modeButton selected"
                        : "modeButton"
                    }
                    onClick={() => setLanguageMode("Learn")}
                  >
                    📖 Learn
                  </button>

                  <button
                    className={
                      languageMode === "Practice"
                        ? "modeButton selected"
                        : "modeButton"
                    }
                    onClick={() => setLanguageMode("Practice")}
                  >
                    ✍️ Practice
                  </button>

                  <button
                    className={
                      languageMode === "Conversation"
                        ? "modeButton selected"
                        : "modeButton"
                    }
                    onClick={() =>
                      setLanguageMode("Conversation")
                    }
                  >
                    💬 Conversation
                  </button>

                  <button
                    className={
                      languageMode === "Quiz"
                        ? "modeButton selected"
                        : "modeButton"
                    }
                    onClick={() => setLanguageMode("Quiz")}
                  >
                    🧠 Quiz
                  </button>
                </div>

                <textarea
                  className="questionBox"
                  placeholder="What would you like to learn?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                <div className="inputBottom">
                  <div className="uploadBox">
                    <span>🖼️</span>

                    <div>
                      <strong>Upload an image</strong>
                      <p>
                        Translate or understand text from an image
                      </p>
                    </div>

                    <input type="file" accept="image/*" />
                  </div>

                  <button
                    className="primaryButton"
                    onClick={startLearning}
                    disabled={loading}
                  >
                    {loading
                      ? "⏳ Learning..."
                      : "✨ Start Learning"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}