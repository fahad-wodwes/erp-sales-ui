import React, { useState, useRef, useEffect } from "react";
import "./SearchField.css";

/**
 * A reusable search field component with suggestion dropdown
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Function to call when value changes (val) => {}
 * @param {Array} props.suggestions - Array of suggestion objects
 * @param {Function} props.onSuggestionSelect - Function to call when suggestion is selected (item) => {}
 * @param {string} props.displayField - Field name to display in suggestions (default: 'name')
 * @param {string} props.valueField - Field name to use for value (default: same as displayField)
 * @param {string} props.secondaryField - Optional second field to display in suggestions
 * @param {boolean} props.readOnly - Whether the field is read-only
 * @param {string} props.labelClass - Custom class for the label
 * @param {boolean} props.required - Whether the field is required
 */
function InputField({ label, value, onChange, suggestions = [], onSuggestionSelect, displayField = "name", valueField, secondaryField, readOnly = false, labelClass = "", required = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && event.target !== inputRef.current) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    // Down arrow
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    }
    // Up arrow
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    // Enter to select
    else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    }
    // Escape to close
    else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(item);
    }
    setIsFocused(false);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setHighlightedIndex(-1); // Reset highlighted suggestion
  };

  return (
    <div className="search-field-container">
      {label && <label className={`search-field-label ${labelClass} ${required ? "required" : ""}`}>{label}</label>}
      <div className="search-field-input-container">
        <input ref={inputRef} className={`search-field-input ${readOnly ? "readonly" : ""}`} type="text" value={value} onChange={handleInputChange} onFocus={() => setIsFocused(true)} onKeyDown={handleKeyDown} readOnly={readOnly} />

        {isFocused && suggestions.length > 0 && (
          <ul ref={dropdownRef} className="search-field-suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} className={`suggestion-item ${index === highlightedIndex ? "highlighted" : ""}`} onClick={() => handleSuggestionClick(suggestion)} onMouseEnter={() => setHighlightedIndex(index)}>
                <span className="primary-text">{suggestion[displayField]}</span>
                {secondaryField && <span className="secondary-text">{suggestion[secondaryField]}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default InputField;
