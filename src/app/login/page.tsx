"use client";

// import LoginController from "@/controller/login";

import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginController from "../controllers/LoginController";
import ByPassLogin from "../middleware/ByPassLogin";
import { AAACECRole } from "../domain/aaacec_roles";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onClickLogin = async () => {
    setLoading(true);
    const { status, role } = await LoginController.login(username, password);
    if (status == 200) {
      setError("");
      if (role === AAACECRole.CONCIERGE) router.replace("/concierge");
      else if (role === AAACECRole.WORKER) router.replace("/bingo");
      else router.replace("/bingo");
    } else if (status == 401) {
      setError("Falha de autenticação");
      setLoading(false);
    } else {
      setError("Erro no servidor, tente novamente mais tarde");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card
        className="w-96 shadow-none"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="mb-4 grid place-items-center text-2xl text-gray-800">
          AAACEC
        </div>
        <CardBody
          className="flex flex-col gap-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="lg"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
          {error}
        </CardBody>
        <CardFooter
          className="pt-0"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="gradient"
            onClick={() => onClickLogin()}
            loading={loading}
            fullWidth
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Entrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ByPassLogin(Login);
