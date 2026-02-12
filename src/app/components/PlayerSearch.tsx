"use client";
import { useState } from "react";
import { RiotAPIService } from "../lib/riot-api";
import { motion } from "motion/react";
import { Button } from "./Button";
export const PlayerSearch = () => {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const onPlayerSearch = async (e: any) => {
    e.preventDefault();
    console.log("triggered");
    const response = await fetch("/api/wrapped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameName, tagLine }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <motion.div className="flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-xl">Seach for Player </h1>

        <form onSubmit={onPlayerSearch}>
          <input
            className="bg-grey"
            name="gameName"
            type="text"
            placeholder="Game Name"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
          <input name="tagLine" type="text" placeholder="Tag Line" />
          <Button type="submit"> Search</Button>
        </form>
      </div>
    </motion.div>
  );
};
