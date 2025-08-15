"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Team, Scores } from '../util'

type ConfirmProps = {
  teams: Team[];
  open: boolean;
  pending: Scores;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isSubmitting: boolean;
};

const ConfirmDialog: React.FC<ConfirmProps> = ({ open, pending, teams, onClose, onConfirm, isSubmitting }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ backdropFilter: 'blur(5px)' }}
    >
      <Box sx={{backgroundImage: 'url("/Fundo.png")', bgcolor: alpha('#000000', 0.9)}}>
        <Box sx={{ position: 'relative', p: 2, bgcolor: alpha('#000000', 0.5) }}>
          <Typography variant="h6" color={'white'} fontWeight="bold" sx={{ textAlign: 'center' }}>
            Confirmar Alterações
          </Typography>
        </Box>
        <DialogContent dividers sx={{ p: 3, bgcolor: alpha('#000000', 0.25) }}>
          <Grid container spacing={2} justifyContent="center">
            {teams.map((t) => (
              <Grid key={t.id} sx={{width: "120px", xs: 12, sm: 6}}>
                <Card sx={{ p: 1, bgcolor: t.bgcolor, borderRadius: 5, boxShadow: 3, borderColor: t.color, borderWidth: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Typography fontSize={"12px"} color={t.color} fontWeight="bold">
                      {t.name}
                    </Typography>
                    <Typography fontSize={"20px"} color={'white'} fontWeight={600}>
                      {pending[t.id] > 0 ? `+${pending[t.id]}` : pending[t.id]}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: alpha('#000000', 0.5) }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            disabled={isSubmitting}
            sx={{backgroundColor: alpha('#000000', 0.3), color: 'white', borderRadius: 2}}
          >
            Cancelar
          </Button>
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={onConfirm}
            disabled={isSubmitting}
            sx={{backgroundColor: alpha('#000000', 0.3), color: 'white', borderRadius: 2}}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;