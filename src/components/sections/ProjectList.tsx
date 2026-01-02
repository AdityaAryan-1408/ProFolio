"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github } from "lucide-react";
import ArchiveModal from "./ArchiveModal";

gsap.registerPlugin(ScrollTrigger);


const PROJECTS = [
    {
        id: 1,
        title: "SourceSeek AI",
        category: "ReactJS, Tailwind, NodeJS, RAG Pipeline, Google Gemini AI, HuggingFace API, Supabase",
        year: "2025",
        description: "Full-stack application enabling users to chat with GitHub repositories. Uses vector embeddings and LLMs to understand codebase context.",
        image: "/projects/reporeader.png",
        github: "https://github.com/AdityaAryan-1408/SourceSeek",
        deploy: "https://source-seek.vercel.app/",
        color: "#3366FF",
    },
    {
        id: 2,
        title: "FetchQuest",
        category: "ReactJS, NodeJS, ExpressJS, MongoDB",
        year: "2025",
        description: "A peer-to-peer delivery platform connecting travelers with senders. Features real-time chat, reputation system and Admin dashboard for control and safety.",
        image: "/projects/fetchquest.png",
        github: "https://github.com/AdityaAryan-1408/FetchQuest",
        deploy: "https://fetch-quest-phi.vercel.app/",
        color: "#CCFF00",
    },
    {
        id: 3,
        title: "PrepBuddy",
        category: "Next JS, Tailwind, Firebase, Google Gemini AI, VAPI",
        year: "2025",
        description: "AI-powered mock interview platform. Features a real-time voice agent that conducts interviews, analyzes speech patterns, and provides feedback.",
        image: "/projects/prepbuddy.png",
        github: "https://github.com/AdityaAryan-1408/PrepBuddy",
        deploy: "https://prep-buddy-hazel.vercel.app/sign-in",
        color: "#FF3366",
    },
];

export default function ProjectList() {
    const containerRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const [activeProject, setActiveProject] = useState<(typeof PROJECTS)[0] | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".project-row", {
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
                x: -50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!revealRef.current || isLocked) return;
            const x = e.clientX;
            const y = e.clientY;

            gsap.to(revealRef.current, {
                x: x,
                y: y,
                duration: 0.4,
                ease: "power3.out",
                rotation: (x - window.innerWidth / 2) * 0.01,
            });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, [isLocked]);

    const handleEnter = (project: typeof PROJECTS[0]) => {
        if (isLocked) return;
        setActiveProject(project);
        gsap.to(revealRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    };

    const handleLeave = () => {
        if (isLocked) return;
        gsap.to(revealRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    };

    const handleClick = (project: typeof PROJECTS[0]) => {
        if (activeProject?.id === project.id && isLocked) {
            setIsLocked(false);
            return;
        }
        setActiveProject(project);
        setIsLocked(true);
        gsap.to(revealRef.current, { scale: 1.1, rotation: 0, duration: 0.3, ease: "back.out(1.7)" });
    };

    const handlePopupLeave = () => {
        if (isLocked) {
            setIsLocked(false);
            gsap.to(revealRef.current, { scale: 0, opacity: 0, duration: 0.3 });
        }
    };

    const closeReveal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLocked(false);
        gsap.to(revealRef.current, { scale: 0, opacity: 0, duration: 0.3 });
    };

    return (
        <section ref={containerRef} id="work" className="py-32 px-6 md:px-12 relative z-10">

            <ArchiveModal isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} />

            <div
                ref={revealRef}
                onMouseLeave={handlePopupLeave}
                className="fixed top-0 left-0 w-[420px] h-[280px] pointer-events-none z-[100]
                   -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0
                   border-2 border-neon-lime bg-black overflow-hidden shadow-[0_0_30px_rgba(204,255,0,0.2)]
                   flex flex-col justify-end"
                style={{
                    pointerEvents: isLocked ? 'auto' : 'none',
                }}
            >
                {activeProject && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={activeProject.image}
                            alt={activeProject.title}
                            fill
                            className="object-cover opacity-80"
                            sizes="360px"
                        />
                    </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 transition-opacity duration-300 ${isLocked ? 'opacity-100' : 'opacity-60'}`} />

                <div className={`relative z-20 p-6 flex flex-col items-center text-center gap-3 transition-all duration-300 ${isLocked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h4 className="font-display text-2xl uppercase text-white tracking-widest drop-shadow-md">{activeProject?.title}</h4>

                    <p className="text-[11px] font-mono text-gray-300 leading-relaxed line-clamp-3">
                        {activeProject?.description}
                    </p>

                    <div className="flex gap-3 mt-2">
                        <Link href={activeProject?.github || "#"} target="_blank" className="flex items-center gap-2 px-4 py-2 border border-neon-lime text-neon-lime hover:bg-neon-lime hover:text-black transition-colors font-mono text-xs uppercase cursor-none"><Github size={14} /> Code</Link>
                        <Link href={activeProject?.deploy || "#"} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-neon-lime text-black hover:bg-white hover:border-white transition-colors font-mono text-xs uppercase font-bold cursor-none">Visit <ArrowUpRight size={14} /></Link>
                    </div>

                    <button onClick={closeReveal} className="mt-1 text-[10px] text-gray-500 hover:text-white underline decoration-dotted cursor-none">[ Close ]</button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-16">
                <span className="text-neon-lime text-xl font-mono">01.</span>
                <h2 className="font-display text-5xl uppercase">Featured Projects</h2>
            </div>

            <div className="flex flex-col border-t border-gray-800">
                {PROJECTS.map((project) => (
                    <div
                        key={project.id}
                        className="project-row group relative border-b border-gray-800 py-12 cursor-none transition-colors hover:bg-white/5"
                        onMouseEnter={() => handleEnter(project)}
                        onMouseLeave={handleLeave}
                        onClick={() => handleClick(project)}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between pointer-events-none">
                            <h3
                                className="font-display text-5xl sm:text-6xl md:text-8xl uppercase transition-all duration-300 group-hover:pl-4 group-hover:text-neon-lime"
                                style={{
                                    WebkitTextStroke: activeProject?.id === project.id ? '0px' : '1px rgba(255,255,255,0.2)',
                                    color: activeProject?.id === project.id ? '#ccff00' : 'transparent'
                                }}
                            >
                                {project.title}
                            </h3>
                            <div className="text-right mt-4 md:mt-0">
                                <p className="text-xs text-gray-500 mb-1 font-mono">{project.category}</p>
                                <p className="text-neon-lime text-sm font-mono">{project.year}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-16">
                <button
                    onClick={() => setIsArchiveOpen(true)}
                    className="font-mono text-xs text-neon-lime border border-neon-lime px-8 py-4 uppercase tracking-widest hover:bg-neon-lime hover:text-black transition-all duration-300 cursor-none"
                >
                    [ View All Projects ]
                </button>
            </div>

        </section>
    );
}