"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    
    router.replace("/3d/scoreboard");
    
    return null;
}