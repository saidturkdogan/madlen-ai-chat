'use client';

import React from 'react';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Models from '../components/Models';
import Footer from '../components/Footer';

export default function LandingPage() {
    const { isLoaded, userId } = useAuth();
    const router = useRouter();

    // If user is already logged in, redirect to chat
    useEffect(() => {
        if (isLoaded && userId) {
            router.push('/chat');
        }
    }, [isLoaded, userId, router]);

    // Show loading while checking auth
    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-madlen-200 border-t-madlen-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Show landing page for non-authenticated users
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <Features />
            <Models />
            <Footer />
        </main>
    );
}
