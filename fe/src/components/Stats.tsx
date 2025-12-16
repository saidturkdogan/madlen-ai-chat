'use client';

import React from 'react';
import { MessageSquare, Users, Zap } from 'lucide-react';

const Stats: React.FC = () => {
    return (
        <section id="stats" className="py-12 bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-xs font-semibold text-madlen-500 uppercase tracking-wider mb-6 text-center">
                    Powering conversations with leading AI models
                </p>

                {/* AI Models Logos */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-50 hover:opacity-80 transition-all duration-500 mb-10">
                    {['Llama', 'Gemma', 'Mistral', 'DeepSeek', 'Qwen', 'Phi'].map((brand) => (
                        <span key={brand} className="text-lg md:text-xl font-bold font-sans text-slate-400">{brand}</span>
                    ))}
                </div>

                {/* Stats Grid - Compact */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                    <div className="p-4 md:p-6 bg-white rounded-xl border border-slate-200 text-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-madlen-50 border border-madlen-100 flex items-center justify-center mx-auto mb-2">
                            <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-madlen-500" />
                        </div>
                        <div className="text-2xl md:text-3xl font-extrabold text-slate-900">10+</div>
                        <div className="text-xs md:text-sm text-slate-500">AI Models</div>
                    </div>
                    <div className="p-4 md:p-6 bg-white rounded-xl border border-slate-200 text-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-madlen-50 border border-madlen-100 flex items-center justify-center mx-auto mb-2">
                            <Zap className="w-4 h-4 md:w-5 md:h-5 text-madlen-500" />
                        </div>
                        <div className="text-2xl md:text-3xl font-extrabold text-slate-900">131K</div>
                        <div className="text-xs md:text-sm text-slate-500">Context</div>
                    </div>
                    <div className="p-4 md:p-6 bg-white rounded-xl border border-slate-200 text-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-madlen-50 border border-madlen-100 flex items-center justify-center mx-auto mb-2">
                            <Users className="w-4 h-4 md:w-5 md:h-5 text-madlen-500" />
                        </div>
                        <div className="text-2xl md:text-3xl font-extrabold text-slate-900">100%</div>
                        <div className="text-xs md:text-sm text-slate-500">Free</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
