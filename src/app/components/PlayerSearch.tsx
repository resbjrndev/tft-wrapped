"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./Button";

export const PlayerSearch = () => {
  const [rioterQuery, setRioterQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onPlayerSearch = async (e: any) => {
    const [rawGameName = "", rawTagLine = ""] = rioterQuery.split("#", 2);
    const gameName = rawGameName.trim()
    const tagLine = rawTagLine.trim();
    e.preventDefault();
    console.log("triggered");
    const response = await fetch("/api/wrapped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameName: gameName, tagLine: tagLine }),
    });

    const data = await response.json();
    console.log(data);
  };



  useEffect(() => {

    const trimmed = rioterQuery.trim()

    const fetchSuggestions = async () => {
      await fetch("/api/wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed })
      })
        .then(res => res.json())
        .then(data => setSuggestions(data.suggestions || []))
        .catch((err) => {
          console.error("Error fetching suggestions:", err);
        });

    }


    fetchSuggestions()


  }, [rioterQuery])






  return (
    <motion.div className="flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-xl">Seach for Player </h1>

        <motion.div className="flex flex-col">

          <form onSubmit={onPlayerSearch}>
            <input
              className="bg-grey"
              name="gameName"
              type="text"
              placeholder="Game Name"
              value={rioterQuery}
              onChange={(e) => setRioterQuery(e.target.value)}
            />
            {suggestions.length > 0 && (
              <motion.ul className="bg-white border border-gray-300 rounded mt-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer">
                    {suggestion}
                  </li>
                ))}
              </motion.ul>
            )}
            <Button type="submit"> Search</Button>

          </form>
        </motion.div>

      </div>
    </motion.div>
  );
};
