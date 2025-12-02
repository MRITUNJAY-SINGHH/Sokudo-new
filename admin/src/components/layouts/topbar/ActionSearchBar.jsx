"use client";
import { useState, useMemo } from "react";
import { menuItemsData } from "../SideNav/menu";
import { useNavigate } from "react-router-dom";

// Flatten all menu items, include parent titles and children
function flattenMenu(items) {
  let result = [];
  items.forEach(item => {
    // Include all items, even if no href
    result.push({
      label: item.label,
      href: item.href || null, // null if no href
    });
    if (item.children) {
      result = result.concat(flattenMenu(item.children));
    }
  });
  return result;
}

const allMenuItems = flattenMenu(menuItemsData);

export default function ActionSearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allMenuItems.filter(item => item.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (href) => {
    if (href) {
      navigate(href);
      setQuery("");
    }
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        placeholder="Search menu..."
        className="w-full px-3 py-2 bg-card border rounded"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {query && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-card border mt-1 rounded shadow max-h-60 overflow-y-auto">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              className={`px-3 py-2 hover:bg-gray-200 cursor-pointer ${!item.href ? 'text-gray-400 cursor-not-allowed' : ''}`}
              onClick={() => handleSelect(item.href)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
