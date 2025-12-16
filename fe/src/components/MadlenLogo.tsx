import React from 'react';

export const MadlenLogo = ({ className = "w-full h-full" }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g fill="none" stroke="#D68C36" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M26 48 
               Q 22 28 36 32 
               Q 42 35 46 32
               Q 50 22 54 32
               Q 58 35 64 32
               Q 78 28 74 48
               L 70 65
               Q 66 82 50 82
               Q 34 82 30 65
               Z" />
            <path d="M39 42 L41 60" />
            <path d="M50 38 L50 62" />
            <path d="M61 42 L59 60" />
        </g>
    </svg>
);
