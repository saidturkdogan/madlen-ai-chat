'use client';

import React from 'react';
import { MessageSquare, Zap, Shield, RefreshCw, Sparkles, Globe } from 'lucide-react';

const features = [
    {
        icon: MessageSquare,
        title: 'Multiple AI Models',
        description: 'Access Llama, Gemma, Mistral, DeepSeek, Qwen, and more - all in one place.'
    },
    {
        icon: RefreshCw,
        title: 'Seamless Switching',
        description: 'Switch between models mid-conversation while keeping your full context.'
    },
    {
        icon: Zap,
        title: 'Fast Response',
        description: 'Get quick responses powered by OpenRouter\'s optimized infrastructure.'
    },
    {
        icon: Shield,
        title: 'Secure & Private',
        description: 'Your conversations are encrypted and never shared with third parties.'
    },
    {
        icon: Sparkles,
        title: '100% Free',
        description: 'All features available for free. No credit card required, no hidden fees.'
    },
    {
        icon: Globe,
        title: 'Works Everywhere',
        description: 'Access from any device with a browser. No installation needed.'
    }
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-madlen-500 uppercase tracking-wider mb-3">
                        Features
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need to chat with AI
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Powerful features designed to give you the best AI chat experience.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-madlen-200 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-madlen-50 border border-madlen-100 flex items-center justify-center mb-4 group-hover:bg-madlen-100 transition-colors">
                                    <Icon className="w-6 h-6 text-madlen-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
