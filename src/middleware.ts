import { NextRequest, NextResponse } from "next/server";
import { JWTSigner } from "./lib/jwt/jwt_signer";

export async function middleware(request: NextRequest) {
  if (
    request.method === "GET" && (
      (
        request.url.includes("/api/v1/challenge") &&
        !request.url.includes("/api/v1/challenge/leaderboard")
      ) 
      || request.url.includes("/api/v1/bingo") 
      || request.url.includes("/api/v1/3d/scores")
    )
  ) {
    return NextResponse.next();
  }
  const auth_token = request.headers.get("Authorization");
  if (!auth_token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = auth_token.replace("Bearer ", "");
  try {
    await JWTSigner.verify(token);
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api((?!/v1/auth).*)",
};
