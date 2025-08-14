"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import Image from 'next/image'
import { alpha } from '@mui/material/styles';
import ConfirmDialog from './ConfirmDialog';
import Scoreboard from './Scoreboard';
import { IconButton } from "@material-tailwind/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddScoreScreen from "./AddScores";
import { TEAMS, Team, Scores } from '../util';

const MainScore: React.FC = () => {
  const [lastWinner, setLastWinner] = useState<string>("");
  const [isAddingScores, setIsAddingScores] = useState<boolean>(true);
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

  const goToScoreboard = () => {
    updateScores();
    updateLastWinner();
    setIsAddingScores(false);
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
        {!isAddingScores && (
            <Button
              onClick={() => setIsAddingScores(true)}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                minWidth: 0,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 30, color: "white" }} />
            </Button>
        )}

        <Image
          src="/Logo.png"
          alt="Logo"
          width={150}
          height={150}
          priority
        />
      </Box>
      {isAddingScores && <AddScoreScreen goToScoreboard={goToScoreboard} allTeams={TEAMS}/>}
      {!isAddingScores && <Scoreboard fromHour={getHour(0)} toHour={getHour(1)} allTeams={TEAMS} scores={scores} lastWinner={lastWinner}/>}
    </Box>
  );
};

export default MainScore;