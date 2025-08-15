"use client";

import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import Image from "next/image";
import { alpha } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginController from "../controllers/LoginController";
import ByPassLogin from "../middleware/ByPassLogin";
import { AAACECRole } from "../domain/aaacec_roles";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onClickLogin = async () => {
    setLoading(true);

    const { status, role } = await LoginController.login(username, password);
    if (status === 200) {
      setError("");
      if (role === AAACECRole.CONCIERGE) router.replace("/concierge");
      else if (role === AAACECRole.WORKER) router.replace("/3d/worker");
      else router.replace("/3d/worker");
    } else if (status === 401) {
      setError("Falha de autenticação");
      setLoading(false);
    } else {
      setError("Erro no servidor, tente novamente mais tarde");
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: '#000000', backgroundImage: 'url("/Fundo.png")' }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          mb: 4,
        }}
      >
        <Image
          src="/Logo.png"
          alt="Logo"
          width={150}
          height={150}
          priority
        />
      </Box>
      <Card sx={{ width: 400 ,bgcolor: alpha('#000000', 0.3), p: 2, borderRadius: 5}}>
        <CardContent>
            <Box display="flex" flexDirection="column" gap={2} >
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              fullWidth
              autoComplete="username"
              sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                borderColor: "#fff",
                },
                "&:hover fieldset": {
                borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                borderColor: "#fff",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#fff",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#fff",
              },
              input: { color: "#fff" },
              }}
            />
            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()} // evita perder o foco
                      edge="end"
                      sx={{ color: "#fff" }} // ícone branco para combinar com o tema
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#fff" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: "#fff" },
                },
                "& .MuiInputLabel-root": { color: "#fff" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
                input: { color: "#fff" },
              }}
            />
            {error && (
              <Typography color="error" variant="body2">
              {error}
              </Typography>
            )}
            </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : null}
            onClick={onClickLogin}
            disabled={loading}
            sx={{backgroundColor: alpha('#4141EB', 1), color: 'white'}}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ByPassLogin(Login);