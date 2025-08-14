"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import Image from 'next/image'
import { alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TeamCard from "./TeamCard";
import { Team, Scores } from '../util';
import ConfirmDialog from './ConfirmDialog';
import SearchIcon from '@mui/icons-material/Search';

const sendScoresToBackend = async (payload: { deltas: Scores }) => {
  console.log("Enviando dados:", payload);
  return new Promise((res) => setTimeout(res, 1000));
};

interface AddScoreScreenProps {
  goToScoreboard: () => void;
  allTeams: Team[];
}

const AddScoreScreen: React.FC<AddScoreScreenProps> = ({ goToScoreboard, allTeams }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<Scores>(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);

  const inc = (id: string, amt: number) =>
    setPending((prev) => ({ ...prev, [id]: prev[id] + amt }));

  const handleConfirm = () => pending && setOpen(true);

  const apply = async () => {
    setLoading(true);
    await sendScoresToBackend({ deltas: pending });
    setPending(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#000000',
        minHeight: '100vh',
        backgroundColor: alpha('#000000', 0.0),
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {allTeams.map((team) => (
          <Grid key={team.id} sx={{width: "120px", xs: 12, sm: 6, md: 4, lg: 3}}>
            <TeamCard team={team} delta={pending[team.id]} onInc={inc} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0, gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{backgroundColor: alpha('#000000', 0.3), color: 'white'}}
            onClick={() => setPending(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores)}
          >
            Limpar
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            sx={{backgroundColor: alpha('#000000', 0.3), color: 'white'}}
            onClick={handleConfirm}
          >
            Enviar
          </Button>
        </Box>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          sx={{backgroundColor: alpha('#000000', 0.3), color: 'white'}}
          onClick={goToScoreboard}
        >
          Ver Pontuações
        </Button>
      </Box>

      <ConfirmDialog
        open={open}
        pending={pending}
        teams={allTeams}
        onClose={() => setOpen(false)}
        onConfirm={apply}
        isSubmitting={loading}
      />
    </Box>
  );
};

export default AddScoreScreen;