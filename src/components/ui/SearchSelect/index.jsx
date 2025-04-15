import React, { useState, useRef, useEffect } from "react";
import "./SearchSelect.css";

function SearchSelect({ label, value, onChange, options = [], displayField = "name", valueField = "id", labelClass = "", required = false, placeholder = "", secondaryField }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Get the display name of the currently selected value
  const selectedOption = options.find((option) => option[valueField] === value);
  const displayValue = selectedOption ? selectedOption[displayField] : "";

  // Set initial options and filter options based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Show only first 4 options when no search query
      setDisplayedOptions(options.slice(0, 4));
      return;
    }

    const filtered = options.filter((option) => {
      const displayText = option[displayField].toLowerCase();
      const query = searchQuery.toLowerCase();

      // Also search in secondary field if provided
      if (secondaryField && option[secondaryField]) {
        const secondaryText = option[secondaryField].toLowerCase();
        return displayText.includes(query) || secondaryText.includes(query);
      }

      return displayText.includes(query);
    });

    setDisplayedOptions(filtered);
    setHighlightedIndex(filtered.length > 0 ? 0 : -1);
  }, [searchQuery, options, displayField, secondaryField]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (!displayedOptions.length) return;

    // Down arrow
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < displayedOptions.length - 1 ? prev + 1 : prev));
    }
    // Up arrow
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    // Enter to select
    else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleOptionSelect(displayedOptions[highlightedIndex]);
    }
    // Escape to close
    else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleOptionSelect = (option) => {
    onChange(option[valueField]);
    setIsOpen(false);
    setSearchQuery("");
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      inputRef.current?.focus();
    }
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
      // Show only first 4 options when opening dropdown
      setDisplayedOptions(options.slice(0, 4));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Scroll to highlighted option
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlighted = dropdownRef.current.querySelector(`.highlighted`);
      if (highlighted) {
        highlighted.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div className="search-field-container" ref={containerRef}>
      {label && <label className={`search-field-label ${labelClass} ${required ? "required" : ""}`}>{label}</label>}

      <div className="search-select-container">
        {/* Select display (shows when collapsed) */}
        <div className="search-select-header" onClick={toggleDropdown}>
          <span className="search-select-value">{displayValue || placeholder}</span>
        </div>

        {/* Dropdown content */}
        {isOpen && (
          <div className="search-select-dropdown">
            <div className="search-select-search">
              <input ref={inputRef} type="text" className="search-field-input" placeholder="輸入以搜尋..." value={searchQuery} onChange={handleSearchChange} onKeyDown={handleKeyDown} autoFocus />
            </div>

            <ul ref={dropdownRef} className="search-field-suggestions">
              {displayedOptions.length > 0 ? (
                displayedOptions.map((option, index) => (
                  <li key={option[valueField]} className={`suggestion-item ${index === highlightedIndex ? "highlighted" : ""} ${option[valueField] === value ? "selected" : ""}`} onClick={() => handleOptionSelect(option)} onMouseEnter={() => setHighlightedIndex(index)}>
                    <span className="primary-text">{option[displayField]}</span>
                    {secondaryField && option[secondaryField] && <span className="secondary-text">{option[secondaryField]}</span>}
                  </li>
                ))
              ) : (
                <li className="no-results">找不到結果</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchSelect;
