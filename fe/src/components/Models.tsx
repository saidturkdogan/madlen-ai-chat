'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

// These are the free models from OpenRouter that we support
const models = [
    {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'Llama 3.3 70B',
        provider: 'Meta',
        description: 'Latest and most capable Llama model with 70B parameters.',
        contextLength: '131K',
        badge: 'Popular'
    },
    {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B',
        provider: 'Google',
        description: 'Efficient and powerful model from Google DeepMind.',
        contextLength: '8K',
        badge: null
    },
    {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        provider: 'Mistral AI',
        description: 'Fast and efficient 7B parameter instruction-tuned model.',
        contextLength: '32K',
        badge: 'Fast'
    },
    {
        id: 'deepseek/deepseek-r1-distill-llama-70b:free',
        name: 'DeepSeek R1 70B',
        provider: 'DeepSeek',
        description: 'Powerful reasoning model distilled from DeepSeek R1.',
        contextLength: '128K',
        badge: 'Reasoning'
    },
    {
        id: 'qwen/qwen-2.5-72b-instruct:free',
        name: 'Qwen 2.5 72B',
        provider: 'Alibaba',
        description: 'Latest Qwen model with excellent multilingual support.',
        contextLength: '131K',
        badge: null
    },
    {
        id: 'microsoft/phi-4:free',
        name: 'Phi-4',
        provider: 'Microsoft',
        description: 'Compact but powerful model from Microsoft Research.',
        contextLength: '16K',
        badge: 'New'
    },
    {
        id: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
        name: 'DeepHermes 3 8B',
        provider: 'Nous Research',
        description: 'Fine-tuned Llama model for helpful conversations.',
        contextLength: '131K',
        badge: null
    },
    {
        id: 'openchat/openchat-7b:free',
        name: 'OpenChat 7B',
        provider: 'OpenChat',
        description: 'Open-source chat model with strong performance.',
        contextLength: '8K',
        badge: null
    }
];

const Models: React.FC = () => {
    return (
        <section id="models" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-madlen-500 uppercase tracking-wider mb-3">
                        AI Models
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Choose from 10+ free AI models
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        All models are completely free to use, powered by OpenRouter.
                    </p>
                </div>

                {/* Models Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {models.map((model, index) => (
                        <div
                            key={index}
                            className="p-5 bg-white rounded-xl border border-slate-200 hover:border-madlen-300 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-slate-900 group-hover:text-madlen-600 transition-colors">
                                        {model.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">{model.provider}</p>
                                </div>
                                {model.badge && (
                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-madlen-50 text-madlen-600 rounded-full border border-madlen-200">
                                        {model.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                {model.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400">
                                    Context: {model.contextLength}
                                </span>
                                <span className="text-xs text-green-600 font-medium">
                                    Free
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* OpenRouter Link */}
                <div className="mt-10 text-center">
                    <a
                        href="https://openrouter.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-madlen-500 transition-colors"
                    >
                        Powered by OpenRouter
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Models;
