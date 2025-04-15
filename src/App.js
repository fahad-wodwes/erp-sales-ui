import React from "react";
import "./App.css";
import SalesForm from "./components/SalesForm";

function App() {
  // App Toolbar Data
  const toolbarButtons = [
    { id: 1, icon: "|◀" }, // Example icons
    { id: 2, icon: "🔈" },
    { id: 3, icon: "➡️" },
    { id: 4, icon: "|▶" },
    { id: 5, icon: "📋" },
    { id: 6, icon: "🖊️" },
    { id: 7, icon: "💾" },
    { id: 8, icon: "✏️" },
    { id: 9, icon: "📝" },
    { id: 10, text: "3.明細瀏覽" },
    { id: 11, text: "P.銷貨單" },
    { id: 12, text: "E.過濾" },
  ];
  return (
    <div className="sales-app">
      <div className="sales-container">
        <SalesForm />
      </div>

      {/* App toolbar */}
      <div className="app-toolbar">
        {toolbarButtons.map((btn) => (
          <button key={btn.id} className={`toolbar-btn ${btn.highlight ? "highlight" : ""}`} title={btn.text || ""}>
            {btn.icon || btn.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
