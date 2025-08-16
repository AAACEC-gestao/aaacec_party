"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    
    // Redirect to login page
    router.replace("/3d/scoreboard");
    
    return null; // No UI to render, just a redirect
}