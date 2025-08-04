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
  <div className="w-full flex justify-start text-left">
  <form onSubmit={submit} className="w-full max-w-xl flex mt-12">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search for songs, artists, albums…"
      className="text-white text-left flex-1 px-4 py-2 rounded-l-md border-none text-lg outline-none mb-8"
    />
  </form>
</div>

  );
}
