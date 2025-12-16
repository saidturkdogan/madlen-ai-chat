'use client';

import React from 'react';
import { ArrowRight, Sparkles, MessageSquare, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero: React.FC = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white pt-24 pb-16 lg:pt-32 lg:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="text-center lg:text-left z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-madlen-50 border border-madlen-200 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-madlen-500" />
                            <span className="text-sm text-madlen-600 font-medium">Free AI Models Available</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                            Chat with <br />
                            <span className="relative whitespace-nowrap">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-madlen-400 to-madlen-600">
                                    Multiple AI Models
                                </span>
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-madlen-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-light">
                            Access powerful AI models like Llama, Gemma, Mistral, and DeepSeek - all in one place.
                            Switch between models seamlessly while keeping your conversation context.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Link
                                href="/sign-up"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-madlen-500 to-madlen-600 hover:from-madlen-600 hover:to-madlen-700 text-white font-semibold rounded-xl shadow-lg shadow-madlen-500/20 transition-all flex items-center justify-center gap-2 group"
                            >
                                Start Chatting Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                            <Link
                                href="/sign-in"
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                Sign In
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">No credit card required • Powered by OpenRouter</p>

                        {/* Features */}
                        <div className="mt-12 grid grid-cols-3 gap-6">
                            <div className="flex flex-col items-center lg:items-start gap-2">
                                <div className="w-10 h-10 rounded-lg bg-madlen-50 border border-madlen-100 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-madlen-500" />
                                </div>
                                <span className="text-sm text-slate-600">Multiple Models</span>
                            </div>
                            <div className="flex flex-col items-center lg:items-start gap-2">
                                <div className="w-10 h-10 rounded-lg bg-madlen-50 border border-madlen-100 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-madlen-500" />
                                </div>
                                <span className="text-sm text-slate-600">Fast Response</span>
                            </div>
                            <div className="flex flex-col items-center lg:items-start gap-2">
                                <div className="w-10 h-10 rounded-lg bg-madlen-50 border border-madlen-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-madlen-500" />
                                </div>
                                <span className="text-sm text-slate-600">Secure & Private</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual (Mockup) - Responsive sizing */}
                    <div className="relative z-10 lg:pl-10">
                        <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-200 p-3 md:p-4 transform rotate-1 hover:rotate-0 transition-transform duration-500 max-w-xs md:max-w-sm lg:max-w-md mx-auto">
                            {/* Simulated Chat Screen */}
                            <div className="aspect-[4/3] bg-slate-50 rounded-xl relative overflow-hidden flex flex-col border border-slate-100">
                                {/* Chat Header */}
                                <div className="px-3 py-2 md:px-4 md:py-3 border-b border-slate-200 flex items-center gap-2 md:gap-3 bg-white">
                                    <Image
                                        src="/logo.png"
                                        alt="Madlen AI"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                                    />
                                    <div>
                                        <div className="text-xs md:text-sm font-medium text-slate-900">Madlen AI</div>
                                        <div className="text-[10px] md:text-xs text-slate-500">Llama 3.3 70B</div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 p-2 md:p-4 space-y-2 md:space-y-4 overflow-hidden bg-slate-50">
                                    <div className="flex justify-end">
                                        <div className="bg-madlen-500 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl rounded-br-none text-xs md:text-sm max-w-[75%]">
                                            How can AI help me learn faster?
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-white text-slate-700 px-2 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl rounded-bl-none text-xs md:text-sm max-w-[85%] border border-slate-200">
                                            AI can personalize your learning path and help you practice! 🚀
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="p-2 md:p-3 border-t border-slate-200 bg-white">
                                    <div className="bg-slate-50 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2 flex items-center gap-2 border border-slate-200">
                                        <div className="flex-1 text-xs md:text-sm text-slate-400">Ask anything...</div>
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-madlen-500 flex items-center justify-center">
                                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements/Decorations */}
                        <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-madlen-300 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 md:w-40 h-32 md:h-40 bg-blue-300 rounded-full blur-3xl opacity-20"></div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-madlen-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Mascot - Decorative */}
            <div className="absolute bottom-8 right-4 md:right-8 lg:right-16 z-20 hidden md:block">
                <Image
                    src="/mascot.png"
                    alt="Madlen AI Mascot"
                    width={140}
                    height={140}
                    className="w-24 h-24 lg:w-32 lg:h-32 object-contain drop-shadow-xl hover:scale-110 transition-transform duration-500"
                />
            </div>
        </section>
    );
};

export default Hero;
