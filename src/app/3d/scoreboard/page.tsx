"use client";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Image from 'next/image'
import { TEAMS, Scores, getScores, getWinner, getHour } from '../util';
import Scoreboard from '../Scoreboard'
import CircularProgress from '@mui/material/CircularProgress';

const MainScore: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastWinner, setLastWinner] = useState<string>("pink");
  const [scores, setScores] = useState<Scores>({ blue: 0, red: 0, pink: 0, green: 0, purple: 0 });

  const updateInfos = async () => {
    setLoading(true);
    try {
      const [oldScores, newScores] = await Promise.all([
        getScores(getHour(-1), getHour(0)),
        getScores(getHour(0), getHour(1)),
      ]);
      setScores(newScores);
      
      if(getHour(0) == "16:00")
        setLastWinner("");
      else
        setLastWinner(getWinner(oldScores));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   updateInfos()
  }, []);

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
      {loading && 
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} sx={{mt: 5}}>
          <CircularProgress />
        </Box>
      }
      {!loading && <Scoreboard fromHour={getHour(0)} toHour={getHour(1)} allTeams={TEAMS} lastWinner={lastWinner} scores={scores}/>}
    </Box>
  );
};

export default MainScore;