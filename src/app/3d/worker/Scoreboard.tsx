"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  CardContent,
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import { Team } from '../util';

interface ScoreboardProps {
  fromHour: string;
  toHour: string;
  allTeams: Team[];
  scores: Record<string, number>;
  lastWinner?: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ fromHour, toHour, allTeams, lastWinner, scores }) => {
  const entries = allTeams.map((t) => ({ team: t, value: scores[t.id] ?? 0 }));

  const winnerText = lastWinner ? allTeams.find(t => t.id === lastWinner)?.name : "";

  const bgWinnerColor = lastWinner
    ? allTeams.find(t => t.id === lastWinner)?.bgcolor || "#000000"
    : "#000000";

  const bgWinnerColorText = lastWinner ? allTeams.find(t => t.id === lastWinner)?.color : "";

  return (
    <Box alignItems={"center"} justifyContent={"center"} display={"flex"} flexDirection={"column"}>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', borderColor: 'divider', borderRadius: 5, bgcolor: alpha('#000000', 0.3), boxShadow: 5, mt: 5 }}>
        {/* Topo com intervalo */}
        <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, justifyContent: 'center', bgcolor: alpha("#000000", 0.3) }}>
          <Typography fontSize={"20px"} fontWeight={1000} color="white">{fromHour} → {toHour}</Typography>
        </Box>

        {/* Miolo com 5 caixinhas coloridas e pontuação */}
        <CardContent sx={{ flexGrow: 1, pt: 3, pb: 3 }}>
          <Grid container spacing={1.5} justifyContent="center">
            {entries.map(({ team, value }) => (
              <Grid key={team.id} sx={{xs: 12, sm: 6, md: 4, lg: 3, width: '100px'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,width: "100%" }}>
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: alpha(team.bgcolor, 1),
                      border: '1px solid',
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
                    <Typography variant="body2" fontWeight={800} sx={{ opacity: 1, color: team.color }}>
                      {team.name}
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      {value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>

      </Box>

      {winnerText && 
        <Box sx={{ m: 5, pt: 2, pb: 2, bgcolor: alpha(bgWinnerColor, 0.7), borderWidth: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',borderRadius: 5, borderColor: bgWinnerColorText, width: "300px" }}>
          <Typography variant="subtitle1" color="white" fontWeight={700}>
            Vencedor da última rodada
          </Typography>
          <Typography variant="subtitle1" color={bgWinnerColorText} fontWeight={700}>
            {winnerText}
          </Typography>
        </Box>
      }
    </Box>
  );
}

export default Scoreboard;