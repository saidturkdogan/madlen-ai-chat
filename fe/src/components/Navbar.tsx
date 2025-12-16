'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="Madlen AI"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            Madlen<span className="text-madlen-500">.ai</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-slate-600 hover:text-madlen-500 font-medium transition-colors">
                            Features
                        </a>
                        <a href="#models" className="text-slate-600 hover:text-madlen-500 font-medium transition-colors">
                            Models
                        </a>
                    </div>

                    {/* Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/sign-in"
                            className="text-slate-600 hover:text-madlen-500 font-medium transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="bg-madlen-500 hover:bg-madlen-600 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-madlen-500/20"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-200">
                    <div className="px-4 py-4 space-y-2">
                        <a
                            href="#features"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-madlen-500 hover:bg-slate-50 rounded-lg"
                        >
                            Features
                        </a>
                        <a
                            href="#models"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-madlen-500 hover:bg-slate-50 rounded-lg"
                        >
                            Models
                        </a>

                        <div className="border-t border-slate-200 my-3 pt-3 space-y-2">
                            <Link
                                href="/sign-in"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-madlen-500 hover:bg-slate-50 rounded-lg"
                            >
                                Login
                            </Link>
                            <Link
                                href="/sign-up"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-madlen-500 hover:bg-slate-50 rounded-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
