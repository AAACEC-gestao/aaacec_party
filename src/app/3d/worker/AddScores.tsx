"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import Cookies from "js-cookie";
import { alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TeamCard from "./TeamCard";
import { Team, Scores, getHour } from '../util';
import ConfirmDialog from './ConfirmDialog';
import DDDController from '../../controllers/DDDController'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AddScoreScreenProps {
  allTeams: Team[];
}

const ERROR_MESSAGE = "Tente novamente";
const SUCCESS_MESSAGE = "Pontos computados com sucesso";

const AddScoreScreen: React.FC<AddScoreScreenProps> = ({ allTeams }) => {
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [pending, setPending] = useState<Scores>(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);

  const inc = (id: string, amt: number) =>
    setPending((prev) => ({ ...prev, [id]: prev[id] + amt }));

  const apply = async () => {
    const token = Cookies.get("token") || "";
    const wasUpdated = await DDDController.applyDeltas(token, pending, getHour(0));

    if( wasUpdated ) {
      setPending(Object.fromEntries(allTeams.map((t) => [t.id, 0])) as Scores);
      setOpenConfirmation(false);

      setSnackbarMessage(SUCCESS_MESSAGE);
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage(ERROR_MESSAGE);
      setOpenSnackbar(true);
    }

    setLoading(false);
  };

  const closeSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
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
            onClick={() => setOpenConfirmation(true)}
          >
            Enviar
          </Button>
        </Box>
      </Box>

      <ConfirmDialog
        open={openConfirmation}
        pending={pending}
        teams={allTeams}
        onClose={() => setOpenConfirmation(false)}
        onConfirm={apply}
        isSubmitting={loading}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{mt: 5}}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarMessage == ERROR_MESSAGE ? "error" : "success"}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddScoreScreen;