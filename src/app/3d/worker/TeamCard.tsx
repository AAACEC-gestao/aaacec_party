"use client";
import React, { useState, memo, forwardRef } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grow,
  IconButton,
  Slide,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CloseIcon from "@mui/icons-material/Close";
import { alpha } from '@mui/material/styles';
import { Team } from '../util';

interface TeamCardProps {
  team: Team; 
  delta: number; 
  onInc: (id: string, amt: number) => void
}

const TeamCard: React.FC<TeamCardProps> = ({team, delta, onInc}) => {
  return (
    <Box>
      <Card
        sx={{
          borderTop: `8px solid ${team.color}`,
          boxShadow: 4,
          bgcolor: alpha(team.bgcolor, 0.7)
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
          <Typography
            fontSize={"18px"}
            sx={{ display: 'flex', alignItems: 'center', color: team.color, fontWeight: 600 }}
          >
            {team.name}
          </Typography>
          <Typography
            fontSize={"30px"}
            fontWeight={700}
            color='white'
          >
            {delta > 0 ? "+" : ""}{delta}
          </Typography>
        </CardContent>
        <Divider sx={{ backgroundColor: alpha("#ffffff", 0.1) }} />
        <CardActions sx={{ justifyContent: 'center' }}>
          <IconButton
            aria-label="Diminuir"
            onClick={() => onInc(team.id, -1)}
            size="medium"
            sx={{  bgcolor: '#ED0000', '&:hover': { bgcolor: '#ED0000' }, marginRight: 2 }}
          >
            <RemoveIcon fontSize="inherit" sx={{color: 'white'}}/>
          </IconButton>
          <IconButton
            aria-label="Aumentar"
            onClick={() => onInc(team.id, 1)}
            size="medium"
            sx={{ bgcolor: '#06B000', '&:hover': { bgcolor: '#06B000' } }}
          >
            <AddIcon fontSize="inherit" sx={{color: 'white'}}/>
          </IconButton>
        </CardActions>
      </Card>
    </Box>
  );
}

export default TeamCard;