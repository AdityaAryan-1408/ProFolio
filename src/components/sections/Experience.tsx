"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, Calendar, Code, GraduationCap, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
    {
        id: 1,
        role: "Web Developer Intern",
        company: "Shikom Solutions",
        date: "Dec 2025 - PRESENT",
        description: "Designing Web apps to run inside native ZOHO environment",
        tech: ["JavaScript", "Zoho CRM", "NodeJS",],
        type: "work"
    }

];

const EDUCATION = [
    {
        id: 1,
        role: "Masters in Computer Applications",
        company: "National Institute of Technology, Jamshedpur",
        date: "2024 - PRESENT",
        description: "",
        tech: ["Web Dev", "Core Computer Fundamentals"],
        type: "edu"
    },
    {
        id: 2,
        role: "Bachelors in Computer Applications",
        company: "Patna University",
        date: "2020 - 2023",
        description: "Graduated with Honors. Led the university coding club.",
        tech: ["Algorithms", "Data Structures", "Networks"],
        type: "edu"
    },
    {
        id: 3,
        role: "High School",
        company: "Don Bosco Academy",
        date: " - 2020",
        description: "",
        tech: [""],
        type: "cert"
    }
];

export default function Experience() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

    const activeData = activeTab === 'experience' ? EXPERIENCES : EDUCATION;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const section = sectionRef.current;
            const trigger = triggerRef.current;

            if (!section || !trigger) return;

            gsap.set(section, { x: 0 });

            const totalWidth = section.scrollWidth - window.innerWidth;

            gsap.to(section, {
                x: -totalWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: trigger,
                    start: "top top",
                    end: `+=${totalWidth + 500}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });
        }, triggerRef);

        return () => ctx.revert();
    }, [activeTab]);

    return (
        <section ref={triggerRef} className="overflow-hidden relative bg-[#050505] text-white">

            <div
                ref={sectionRef}
                className="h-screen flex items-center px-12 md:px-24 w-max"
            >

                <div className="w-[80vw] md:w-[40vw] flex-shrink-0 pr-12 flex flex-col justify-center z-10 sticky left-12 md:left-24">
                    <span className="text-neon-lime text-xl font-mono mb-4 block">02.</span>

                    <h2 className="font-display text-6xl md:text-8xl uppercase leading-none mb-8">
                        {activeTab === 'experience' ? 'CAREER_' : 'STUDY_'} <br />
                        <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Timeline</span>
                    </h2>

                    <div className="flex flex-col gap-4 mb-8 max-w-sm">
                        <button
                            onClick={() => setActiveTab('experience')}
                            className={`font-mono text-left text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-4 px-6 py-4 border w-full
                                ${activeTab === 'experience'
                                    ? "bg-neon-lime text-black border-neon-lime font-bold shadow-[0_0_20px_rgba(204,255,0,0.4)] translate-x-2"
                                    : "bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span className={`text-lg ${activeTab === 'experience' ? "animate-pulse" : "opacity-50"}`}>//</span>
                            EXPERIENCE
                        </button>

                        <button
                            onClick={() => setActiveTab('education')}
                            className={`font-mono text-left text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-4 px-6 py-4 border w-full
                                ${activeTab === 'education'
                                    ? "bg-neon-lime text-black border-neon-lime font-bold shadow-[0_0_20px_rgba(204,255,0,0.4)] translate-x-2"
                                    : "bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span className={`text-lg ${activeTab === 'education' ? "animate-pulse" : "opacity-50"}`}>//</span>
                            EDUCATION
                        </button>
                    </div>

                    <p className="font-mono text-xs text-gray-500 max-w-md">
                        {activeTab === 'experience'
                            ? "A chronological archive of professional milestones and commercial projects."
                            : "Academic qualifications, research papers, and technical certifications."}
                    </p>
                </div>

                <div className="flex gap-12 relative pl-12 md:pl-0">

                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -z-10 transform -translate-y-1/2"></div>

                    {activeData.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative w-[85vw] md:w-[600px] flex-shrink-0 group"
                        >
                            <div className="absolute top-1/2 left-[-6px] w-3 h-3 bg-black border border-neon-lime rounded-full transform -translate-y-1/2 group-hover:bg-neon-lime transition-colors duration-300 shadow-[0_0_10px_rgba(204,255,0,0.3)]"></div>

                            <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 hover:border-neon-lime transition-all duration-300 hover:bg-white/5 relative group-hover:-translate-y-2 h-full">

                                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                                    <div>
                                        <h3 className="font-display text-3xl uppercase text-white mb-1 group-hover:text-neon-lime transition-colors">
                                            {item.company}
                                        </h3>
                                        <div className="flex items-center gap-2 text-neon-lime font-mono text-xs">
                                            {item.type === 'work' ? <Briefcase size={12} /> : item.type === 'cert' ? <Award size={12} /> : <GraduationCap size={12} />}
                                            <span>{item.role}</span>
                                        </div>
                                    </div>
                                    <div className="font-mono text-xs text-gray-500 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                                        <Calendar size={12} />
                                        {item.date}
                                    </div>
                                </div>

                                <p className="font-mono text-sm text-gray-400 mb-8 leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {item.tech.map((t, i) => (
                                        <span key={i} className="text-[10px] font-mono border border-neon-lime/30 text-neon-lime/70 px-2 py-1 uppercase hover:bg-neon-lime hover:text-black transition-colors cursor-default">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <span className="absolute -top-6 left-0 text-[10rem] font-display text-white/5 pointer-events-none leading-none z-0">
                                    0{index + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-[30vw] flex-shrink-0 flex items-center justify-center pl-12">
                    <div className="text-center">
                        <div className="w-16 h-16 border border-neon-lime rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                            <Code className="text-neon-lime" />
                        </div>
                        <p className="font-mono text-xs text-gray-500">END OF LOGS</p>
                    </div>
                </div>

            </div>
        </section>
    );
}