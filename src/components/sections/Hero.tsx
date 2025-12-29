"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Download } from "lucide-react";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-anim", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: "power4.out",
                delay: 0.2,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen relative flex items-center px-6 md:px-12 w-full max-w-[1600px] mx-auto"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-8 z-10 mix-blend-difference items-center h-full">

                <div className="flex flex-col justify-center">
                    <p className="hero-anim text-neon-lime text-sm mb-4 tracking-widest border-l-2 border-neon-lime pl-4 font-mono">
                        CREATIVE FULL STACK DEVELOPER
                    </p>
                    <h1 className="hero-anim font-display text-7xl md:text-[8rem] lg:text-[10rem] leading-[0.9] uppercase text-white">
                        Code <br />
                        <span
                            className="text-transparent"
                            style={{ WebkitTextStroke: "2px #fff" }}
                        >
                            Is Art
                        </span>
                    </h1>
                </div>

                <div className="hidden md:block pointer-events-none"></div>

                <div className="hero-anim flex flex-col justify-center items-start md:items-end text-left md:text-right">
                    <div className="backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/10 max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-3 tracking-wide">
                            About Me
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light mb-6">
                            I am Aditya Aryan, a Full Stack dev based in India.
                            Bridging the gap between <strong className="text-neon-lime font-medium">backend efficiency</strong> and <strong className="text-neon-lime font-medium">frontend elegance</strong>,
                            I build systems that are not just functional, but beautiful.
                            Currently exploring the depths of GenAI and DevOps.
                        </p>

                        <div className="flex justify-start md:justify-end">
                            <a
                                href="/resume.pdf"
                                download="Aditya_Aryan_Resume.pdf"
                                className="group flex items-center gap-3 px-5 py-2.5 border border-white/30 hover:border-neon-lime hover:bg-neon-lime/10 transition-all duration-300 rounded-md"
                            >
                                <span className="font-mono text-xs font-bold tracking-widest text-white group-hover:text-neon-lime transition-colors uppercase cursor-none">
                                    Download CV
                                </span>
                                <Download className="w-4 h-4 text-gray-400 group-hover:text-neon-lime transition-colors group-hover:translate-y-1" />
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <div className="absolute bottom-10 left-6 md:left-12 flex items-center gap-4 text-xs text-gray-500 font-mono z-20">
                <div className="w-2 h-2 bg-neon-lime rounded-full animate-ping"></div>
                <span>SYSTEM ONLINE</span>
                <span>::</span>
                <span>SCROLL TO INITIALIZE</span>
            </div>
        </section>
    );
}