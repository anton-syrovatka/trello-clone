"use client";

import Image from "next/image";
import Avatar from "react-avatar";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import { useSearchStore } from "@/store/SearchStore";
import fetchAITaskSummary from "@/lib/fetchAITaskSummary";

function Header() {
  const [board] = useBoardStore((state) => [state.board]);

  const [searchTerm, setSearchTerm] = useSearchStore((state) => [
    state.searchTerm,
    state.setSearchTerm,
  ]);

  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (board.columns.size === 0) {
      return;
    }
    setLoading(true);

    (async () => {
      try {
        const suggestion = await fetchAITaskSummary(board);

        setSuggestion(suggestion);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [board, setLoading]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="absolute top-0 lef-0 w-full h-96 bg-gradient-to-br from-pink-400
            to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50"
        />
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello Logo"
          height={100}
          width={300}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />

        <div className="flex items-center space-x-5 flex-1 justify-end">
          <form
            className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1
              md:flex-initial"
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          <Avatar name="Anton Syrovatka" round size="50" color="#0055D1" />
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p
          className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white
            italic max-w-3xl text-[#0055D1]"
        >
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarizing your tasks for the day ..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
