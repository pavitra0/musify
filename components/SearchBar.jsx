import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");
  function submit(e) {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  }
  return (
    <form onSubmit={submit} className="w-full max-w-xl flex mt-12">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for songs, artists, albums…"
        className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 border-none text-lg outline-none"
      />
      
    </form>
  );
}
