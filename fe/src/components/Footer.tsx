'use client';

import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-slate-100 to-slate-50 text-slate-900 pt-24 pb-10">
            {/* Pre-footer CTA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="bg-gradient-to-r from-madlen-500 to-madlen-400 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 text-white">
                    <div className="flex-1 space-y-5">
                        <h2 className="text-2xl md:text-4xl font-bold">Ready to chat with AI?</h2>
                        <ul className="space-y-2 font-medium text-white/90">
                            <li className="flex items-center gap-2"><Check size={18} /> Choose your AI model</li>
                            <li className="flex items-center gap-2"><Check size={18} /> Start a conversation</li>
                            <li className="flex items-center gap-2"><Check size={18} /> Get instant responses</li>
                        </ul>
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center bg-white hover:bg-slate-100 text-madlen-600 px-6 py-3 rounded-lg font-semibold transition-all group shadow-lg"
                        >
                            Start Chatting Free <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </Link>
                        <p className="text-sm text-white/70">No credit card required</p>
                    </div>
                    <div className="flex-1 flex justify-center">
                        {/* Chat bubble graphic */}
                        <div className="relative w-48 h-48 md:w-56 md:h-56 bg-white/10 backdrop-blur-sm rounded-2xl rotate-3 shadow-2xl flex flex-col items-center justify-center p-6">
                            <Image
                                src="/logo.png"
                                alt="Madlen AI"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full mb-3"
                            />
                            <div className="text-xl font-bold">Madlen AI</div>
                            <div className="text-sm text-white/70">Your AI Assistant</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo & Description - Full width on mobile */}
                    <div className="col-span-2 md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="Madlen AI"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-xl font-bold">Madlen<span className="text-madlen-500">.ai</span></span>
                        </Link>
                        <p className="text-slate-600 text-sm max-w-xs">
                            Access multiple AI models in one place. Chat with Llama, Gemma, Mistral, and more - all for free.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-bold mb-4 text-slate-900">Product</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="#features" className="hover:text-madlen-500 transition-colors">Features</a></li>
                            <li><a href="#models" className="hover:text-madlen-500 transition-colors">AI Models</a></li>
                            <li><a href="/contact" className="hover:text-madlen-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold mb-4 text-slate-900">Resources</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><a href="https://openrouter.ai" target="_blank" rel="noopener" className="hover:text-madlen-500 transition-colors">OpenRouter</a></li>
                            <li><a href="/terms" className="hover:text-madlen-500 transition-colors">Terms</a></li>
                            <li><a href="/privacy" className="hover:text-madlen-500 transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="border-slate-200" />

                <div className="py-6 flex flex-wrap gap-6 text-xs text-slate-500 justify-center md:justify-start">
                    <a href="/contact" className="hover:text-madlen-500 transition-colors">Contact</a>
                    <a href="/terms" className="hover:text-madlen-500 transition-colors">Terms of Service</a>
                    <a href="/privacy" className="hover:text-madlen-500 transition-colors">Privacy Policy</a>
                    <span className="text-slate-400">© 2025 Madlen AI</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
