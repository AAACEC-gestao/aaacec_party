"use client";

import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    
    // Redirect to login page
    router.replace("/bingo");
    
    return null; // No UI to render, just a redirect
}