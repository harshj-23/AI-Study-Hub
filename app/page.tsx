
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";



export default function Home() {
const [mode, setMode] = useState<"home" | "academic" | "language">("home");
const [question, setQuestion] = useState("");
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
      question: question,
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

if (mode === "academic") {
return ( <main className="page"> <nav className="navbar">
<button className="logo" onClick={() => setMode("home")}>
🎓 AI Study Hub </button>

```
      <button className="navButton" onClick={() => setMode("home")}>
        Home
      </button>
    </nav>

    <section className="workspace">
      <div className="sectionHeader">
        <p className="eyebrow">AI LEARNING ASSISTANT</p>

        <h1>📚 Academic Solver</h1>

        <p>
          Ask questions from mathematics, physics, engineering,
          programming and other subjects.
        </p>
      </div>

      <div className="solverCard">
        <textarea
          className="questionBox"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="uploadBox">
          <span>🖼️</span>

          <div>
            <strong>Upload a question image</strong>
            <p>PNG, JPG, JPEG or WEBP</p>
          </div>

          <input type="file" accept="image/*" />
        </div>

        <button
          className="primaryButton"
          onClick={solveQuestion}
          disabled={loading}
        >
          {loading ? "⏳ Solving..." : "✨ Solve Question"}
        </button>

      
        {answer && (
          <div className="answerBox">
            <h2>Answer</h2>

            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {answer}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </section>
  </main>
);


}

if (mode === "language") {
return ( <main className="page"> <nav className="navbar">
<button className="logo" onClick={() => setMode("home")}>
🎓 AI Study Hub </button>

```
      <button className="navButton" onClick={() => setMode("home")}>
        Home
      </button>
    </nav>

    <section className="workspace">
      <div className="sectionHeader">
        <p className="eyebrow">LANGUAGE LEARNING ASSISTANT</p>

        <h1>🌍 Low-Resource Language Tutor</h1>

        <p>
          Learn vocabulary, grammar, pronunciation and conversation
          with an AI tutor.
        </p>
      </div>

      <div className="solverCard">
        <div className="selectRow">
          <select className="selectBox">
            <option>Tamil</option>
            <option>Marathi</option>
            <option>Telugu</option>
            <option>Hindi</option>
            <option>Kannada</option>
            <option>Bengali</option>
            <option>Other</option>
          </select>

          <select className="selectBox">
            <option>Beginner</option>
            <option>Elementary</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div className="modeButtons">
          <button className="modeButton">📖 Learn</button>
          <button className="modeButton">✍️ Practice</button>
          <button className="modeButton">💬 Conversation</button>
          <button className="modeButton">🧠 Quiz</button>
        </div>

        <textarea
          className="questionBox"
          placeholder="What would you like to learn?"
        />

        <div className="uploadBox">
          <span>🖼️</span>

          <div>
            <strong>Upload an image</strong>
            <p>Translate or understand text from an image</p>
          </div>

          <input type="file" accept="image/*" />
        </div>

        <button className="primaryButton">
          ✨ Start Learning
        </button>
      </div>
    </section>
  </main>
);


}

return ( <main className="page"> <nav className="navbar">
<button className="logo" onClick={() => setMode("home")}>
🎓 AI Study Hub </button>

```
    <div className="navLinks">
      <button onClick={() => setMode("academic")}>
        Academic Solver
      </button>

      <button onClick={() => setMode("language")}>
        Language Tutor
      </button>
    </div>
  </nav>

  <section className="hero">
    <div className="heroContent">
      <p className="eyebrow">AI-POWERED LEARNING</p>

      <h1>
        Learn smarter with
        <span> AI Study Hub</span>
      </h1>

      <p className="heroText">
        Your personal AI learning assistant for academic problem solving
        and learning low-resource languages.
      </p>
    </div>

    <div className="featureGrid">
      <button
        className="featureCard"
        onClick={() => setMode("academic")}
      >
        <div className="icon">📚</div>

        <h2>Academic Solver</h2>

        <p>
          Solve and understand questions from mathematics, physics,
          engineering and computer science.
        </p>

        <span className="cardLink">
          Start solving →
        </span>
      </button>

      <button
        className="featureCard"
        onClick={() => setMode("language")}
      >
        <div className="icon">🌍</div>

        <h2>Low-Resource Language Tutor</h2>

        <p>
          Learn languages progressively through vocabulary, practice,
          conversation and quizzes.
        </p>

        <span className="cardLink">
          Start learning →
        </span>
      </button>
    </div>
  </section>

  <footer>
    <p>AI Study Hub • Built for smarter learning</p>
  </footer>
</main>

);
}
