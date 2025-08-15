"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import Image from 'next/image'
import Cookies from "js-cookie";
import { alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TeamCard from "./TeamCard";
import { Team, Scores } from '../util';
import ConfirmDialog from './ConfirmDialog';
import SearchIcon from '@mui/icons-material/Search';
import DDDController from '../../controllers/DDDController'

interface AddScoreScreenProps {
  allTeams: Team[];
}

const AddScoreScreen: React.FC<AddScoreScreenProps> = ({ allTeams }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<Scores>(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);

  const inc = (id: string, amt: number) =>
    setPending((prev) => ({ ...prev, [id]: prev[id] + amt }));

  const handleConfirm = () => pending && setOpen(true);

  const apply = async () => {
    setLoading(true);
    setPending(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);
    setLoading(false);
    setOpen(false);



    // await sendScoresToBackend({ deltas: pending });

    // const now = new Date();
    // const token = Cookies.get("token") || "";
    
    // const wasUpdated = await DDDController.applyDeltas(token, pending, now.toString());

    // if( wasUpdated ) {
    //   setPending(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);
    //   setLoading(false);
    //   setOpen(false);
    // }

    // if (newScore === -1) {
    //   toast.error("Erro ao comprar item!");
    // } else if (newScore === -2) {
    //   toast.warn("Pontos insuficientes!");
    // } else {
    //   toast.success("Item comprado com sucesso!\nPontos restantes: " + newScore);
    // }
  };

  return (
    <Box
      sx={{
        pt: 3,
        bgcolor: '#000000',
        backgroundColor: alpha('#000000', 0.0),
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {allTeams.map((team) => (
          <Grid key={team.id} sx={{width: "130px", xs: 12, sm: 6, md: 4, lg: 3}}>
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