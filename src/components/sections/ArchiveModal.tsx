"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Github, X, Info } from "lucide-react";

const ARCHIVE = [
    { year: "2025", title: "PassGuard", description: "End-to-End encypted Password Manager", tools: "React, Tailwind, Firebase", github: "https://github.com/AdityaAryan-1408/PassGuard-App", deploy: "https://passguard-2aeb8.web.app/" },
    { year: "2025", title: "DevGuess", description: "Wordle Style word guessing game with varible word size", tools: "React", github: "https://github.com/AdityaAryan-1408/DevGuess", deploy: "#" },
    { year: "2025", title: "AI Chef", description: "Recipe generator for entered Ingredients using HuggingFace AI API", tools: "React, HuggingFace API", github: "https://github.com/AdityaAryan-1408/Ai-Chef", deploy: "#" },
    { year: "2025", title: "ProFolio", description: "Professional Portfolio Website", tools: "Next.JS, TypeScript, Tailwind", github: "https://github.com/AdityaAryan-1408/ProFolio", deploy: "https://aditya-aryan-portfolio.vercel.app/" },
];

interface ArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ArchiveModal({ isOpen, onClose }: ArchiveModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeDescIndex, setActiveDescIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            gsap.to(modalRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
            gsap.fromTo(
                ".archive-row",
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, delay: 0.1 }
            );
        } else {
            document.body.style.overflow = "unset";
            gsap.to(modalRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
            setActiveDescIndex(null);
        }
    }, [isOpen]);

    const toggleDescription = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDescIndex(activeDescIndex === index ? null : index);
    };

    return (
        <div
            ref={modalRef}
            onClick={() => setActiveDescIndex(null)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md opacity-0 pointer-events-none flex justify-center items-center"
        >
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-500 hover:text-neon-lime transition-colors cursor-none"
            >
                <X size={48} />
            </button>

            <div className="w-full max-w-5xl px-6 h-[80vh] overflow-y-auto scrollbar-hide flex flex-col">
                <h2 className="font-display text-4xl mb-12 text-neon-lime">Archive_</h2>

                <div className="w-full font-mono text-sm text-gray-400">

                    <div className="grid grid-cols-12 border-b border-gray-800 pb-4 mb-4 uppercase tracking-widest text-xs">
                        <div className="col-span-1">Year</div>
                        <div className="col-span-5 md:col-span-4">Project</div>
                        <div className="col-span-3 hidden md:block">Built With</div>
                        <div className="col-span-6 md:col-span-4 text-right">Links</div>
                    </div>


                    {ARCHIVE.map((item, i) => (
                        <div key={i} className="archive-row grid grid-cols-12 py-4 border-b border-gray-800/50 hover:bg-white/5 transition-colors items-center group relative">
                            <div className="col-span-1 text-neon-lime">{item.year}</div>


                            <div className="col-span-5 md:col-span-4 font-bold text-white relative">
                                <button
                                    onClick={(e) => toggleDescription(i, e)}
                                    className="hover:text-neon-lime transition-colors text-left flex items-center gap-2 cursor-none focus:outline-none"
                                >
                                    {item.title}
                                    <Info size={12} className="opacity-50" />
                                </button>

                                {activeDescIndex === i && (
                                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-off-black border border-neon-lime p-3 z-50 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                                        <div className="text-xs text-gray-300 font-normal leading-relaxed">
                                            {item.description}
                                        </div>
                                        <div className="absolute top-full left-4 w-2 h-2 bg-neon-lime rotate-45 transform -translate-y-1"></div>
                                    </div>
                                )}
                            </div>

                            <div className="col-span-3 hidden md:block text-xs">{item.tools}</div>

                            <div className="col-span-6 md:col-span-4 flex justify-end gap-4 text-xs">
                                <a href={item.github} target="_blank" className="hover:text-white flex items-center gap-1 cursor-none transition-colors">
                                    <Github size={12} /> <span className="hidden md:inline">GitHub</span>
                                </a>
                                {item.deploy !== "#" && (
                                    <a
                                        href={item.deploy}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neon-lime hover:text-white flex items-center gap-1 cursor-none transition-colors"
                                    >
                                        View <ArrowUpRight size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center pb-12">
                    <button
                        onClick={onClose}
                        className="font-mono text-xs text-gray-500 hover:text-white underline decoration-dotted cursor-none"
                    >
                        [ CLOSE ARCHIVE ]
                    </button>
                </div>
            </div>
        </div>
    );
}