"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import Image from 'next/image'
import AddScoreScreen from "./AddScores";
import { TEAMS, Scores } from '../util';
import { AAACECRole } from "../../domain/aaacec_roles";
import WithAuthentication from "../../middleware/WithAuthentication";

const MainScore = () => {
  const [lastWinner, setLastWinner] = useState<string>("");
  const [scores, setScores] = useState<Scores>({ blue: 0, red: 0, pink: 0, green: 0, purple: 0 });

  const updateLastWinner = () => {
    setLastWinner(Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b));
  }

  const updateScores = () => {
    const newScores: Scores = { blue: Math.floor(Math.random() * 100),
      red: Math.floor(Math.random() * 100),
      pink: Math.floor(Math.random() * 100),
      green: Math.floor(Math.random() * 100),
      purple: Math.floor(Math.random() * 100),
    };

    setScores(newScores);
  }

  const getHour = (delta: number) => {
    const now = new Date();
    const currentHour = now.getHours();
    return `${(currentHour + delta).toString().padStart(2, '0')}:00`;
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#000000',
        minHeight: '100vh',
        backgroundImage: 'url("/Fundo.png")'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Image
          src="/LogoCelular.png"
          alt="Logo"
          width={1000}
          height={120}
          priority
        />
      </Box>
      <AddScoreScreen allTeams={TEAMS}/>
    </Box>
  );
};

export default WithAuthentication(MainScore, [AAACECRole.WORKER, AAACECRole.ADMIN]);
