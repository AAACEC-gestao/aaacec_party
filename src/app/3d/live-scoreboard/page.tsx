"use client";
import React, { useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { alpha } from '@mui/material/styles';
import { IconButton } from "@material-tailwind/react";
import { Allerta } from "next/font/google";
import { TEAMS, Team, Scores, getScores, getHour, getWinner } from '../util';

const Scoreboard: React.FC = () => {
  const [lastWinner, setLastWinner] = React.useState<string>("");
  const [scores, setScores] = React.useState<Record<string, number>>({});

  const updateInfos = async () => {
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
    }
  };

  useEffect(() => {
    updateInfos();
    const id = setInterval(updateInfos, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#000000',
        minHeight: '100vh',
        backgroundImage: 'url("/Fundo.png")',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <Image
        src="/LogoReta.png"
        alt="LogoReta"
        height={200}
        width={1000}
        priority
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', borderColor: 'divider', borderRadius: 5, m: 2 }} alignItems={"center"} justifyContent="center" width={"100%"}>
      <CardContent sx={{ flexGrow: 1, pb: 3, width: '100%' }}>
        <Grid container spacing={1.5} justifyContent="center">
        {TEAMS.map(team => (
          <Grid key={team.id} sx={{xs: 12, sm: 6, md: 4, lg: 3, width: '30%'}}>
          <Box sx={{ display: 'flex', alignItems: 'center',width: "100%" }}>
            <Box
            sx={{
              flex: 1,
              bgcolor: alpha(team.color, 1),
              borderColor: alpha(team.color, 1),
              borderRadius: 1.5,
              p: 1,
              textAlign: 'center',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
            <Typography fontSize={"30px"} fontWeight={800} sx={{ opacity: 1, color: "white" }}>
              {team.name}
            </Typography>
            <Typography fontSize={"100px"} fontWeight={800}>
              {scores[team.id] ?? 0}
            </Typography>
            </Box>
          </Box>
          </Grid>
        ))}
        </Grid>
      </CardContent>

      </Box>

      {lastWinner && 
      (() => {
        const winnerTeam = TEAMS.find(t => t.id === lastWinner);
        return (
        <Box sx={{ m: 5, mt: 1, pt: 2, pb: 2, bgcolor: alpha(winnerTeam?.color ?? "#000", 1), borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 5, width: '100%' }}>
          <Typography fontSize={"50px"} color="white" fontWeight={700}>
          Vencedor da última rodada:
          </Typography>
          <Typography fontSize={"50px"} color="white" fontWeight={700} sx={{ ml: 2 }}>
          {winnerTeam?.name ?? lastWinner}
          </Typography>
        </Box>
        );
      })()
      }
    </Box>
  );
}

export default Scoreboard;