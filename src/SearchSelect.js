// SearchSelect.js
import React, { useState, useRef, useEffect } from "react";
import "./SearchSelect.css"; // Reuse the existing CSS

/**
 * A searchable select component for handling large lists of options
 * Shows only 4 options initially, then filters on search
 *
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.value - Current selected value
 * @param {Function} props.onChange - Function to call when value changes (val) => {}
 * @param {Array} props.options - Array of option objects
 * @param {string} props.displayField - Field name to display in options (default: 'name')
 * @param {string} props.valueField - Field name to use for value (default: 'id')
 * @param {string} props.labelClass - Custom class for the label
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text
 */
function SearchSelect({ label, value, onChange, options = [], displayField = "name", valueField = "id", labelClass = "", required = false, placeholder = "Search...", secondaryField }) {
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
          {/* <span className="search-select-arrow">{isOpen ? "▲" : "▼"}</span> */}
        </div>

        {/* Dropdown content */}
        {isOpen && (
          <div className="search-select-dropdown">
            <div className="search-select-search">
              <input ref={inputRef} type="text" className="search-field-input" placeholder="Type to search..." value={searchQuery} onChange={handleSearchChange} onKeyDown={handleKeyDown} autoFocus />
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
                <li className="no-results">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchSelect;
