import { AuthRepository } from "../../../../repositories/auth_repository";

class LoginRoute {
  static async POST(request: Request) {
    const body = await request.json();
    const username = body.username;
    const password = body.password;
    try {
      const token = await AuthRepository.login(username, password);

      return Response.json({ token,  }, { status: 200 });
    } catch (error) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
  }
}

export function POST(request: Request) {
  return LoginRoute.POST(request);
}
