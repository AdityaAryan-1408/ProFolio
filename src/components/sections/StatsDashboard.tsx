"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Twitter, FolderGit2, ArrowRight } from "lucide-react";
import clsx from "clsx";
import axios from "axios";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextdotjs" },
    { name: "TypeScript", icon: "typescript" },
    { name: "JavaScript", icon: "javascript" },
    { name: "TailwindCSS", icon: "tailwindcss" },
    { name: "Node.js", icon: "nodedotjs" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "MongoDB", icon: "mongodb" },
    { name: "Docker", icon: "docker" },
    { name: "Kubernetes", icon: "kubernetes" },
    { name: "Git", icon: "git" },
    { name: "FireBase", icon: "firebase" },
    { name: "Python", icon: "python" },
    { name: "C++", icon: "cplusplus" },


];

const PLATFORM_ICONS: Record<string, string> = {
    "LeetCode": "leetcode",
    "CodeForces": "codeforces",
    "CodeChef": "codechef"
};

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

interface ApiData {
    totalSolved: number;
    platforms: {
        name: string;
        count: number;
        url: string;
        ranking: string | null;
        repoCount?: number; 
    }[];
    heatmap: { date: string; count: number; intensity: number }[];
}

type TooltipState = {
    date: string;
    count: string;
    x: number;
    y: number;
    visible: boolean;
};

export default function StatsDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [scrollDirection, setScrollDirection] = useState<'right' | 'left'>('right');
    const [isScrollable, setIsScrollable] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const [tooltip, setTooltip] = useState<TooltipState>({
        date: "", count: "0", x: 0, y: 0, visible: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/stats');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".profile-trigger", {
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
            });
            gsap.to(".stats-trigger", {
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
                opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out",
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const calendarData = useMemo(() => {
        if (!data?.heatmap) return [];

        const yearData = data.heatmap.filter(d => d.date.startsWith(selectedYear.toString()));
        const grouped = new Map<string, typeof yearData>();

        yearData.forEach(day => {
            const dateObj = new Date(day.date);
            const monthKey = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();

            if (!grouped.has(monthKey)) grouped.set(monthKey, []);
            grouped.get(monthKey)?.push(day);
        });

        return Array.from(grouped.entries()).map(([month, days]) => ({ month, days }));
    }, [data, selectedYear]);

    useEffect(() => {
        const checkScrollable = () => {
            const el = scrollContainerRef.current;
            if (el) {
                setIsScrollable(el.scrollWidth > el.clientWidth);
                setScrollDirection('right');
            }
        };
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        return () => window.removeEventListener('resize', checkScrollable);
    }, [calendarData]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMoveDrag = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
        setScrollDirection(isAtEnd ? 'left' : 'right');
    };

    const handleMouseEnter = (e: React.MouseEvent, date: string, count: number) => {
        if (isDragging) return;
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setTooltip({
            visible: true,
            date,
            count: count.toString(),
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        });
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    const scrollToProjects = () => {
        const element = document.getElementById("work");
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="about" ref={containerRef} className="py-24 px-6 md:px-12 border-t border-gray-800 bg-[#050505] relative z-10 scroll-mt-20">

            <div
                ref={tooltipRef}
                className="fixed pointer-events-none z-[9999] bg-[#0a0a0a] border border-neon-lime p-2 min-w-[120px] shadow-[0_0_15px_rgba(204,255,0,0.15)] transition-opacity duration-150"
                style={{
                    opacity: tooltip.visible ? 1 : 0,
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: 'translate(-50%, -100%)'
                }}
            >
                <p className="text-[10px] text-gray-400 font-mono mb-1 border-b border-white/10 pb-1">{tooltip.date}</p>
                <div className="flex justify-between text-xs font-mono">
                    <span>ACTIVITY</span>
                    <span className="text-neon-lime">{tooltip.count}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">

                <div className="w-full md:w-1/3 flex flex-col gap-6 profile-trigger opacity-0 translate-y-10">
                    <div className="relative group border border-white/20 p-2 hover:border-neon-lime transition">
                        <div className="aspect-[4/5] overflow-hidden bg-gray-900 relative">
                            <Image
                                src="/me.jpg"
                                alt="Profile"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition duration-500"
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-display text-4xl uppercase">Aditya <span className="text-neon-lime">Aryan</span></h2>
                        <div className="flex gap-4 mt-4">
                            <a href="https://github.com/AdityaAryan-1408" target="_blank">
                                <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-none" />
                            </a>
                            <a href="https://www.linkedin.com/in/aditya-aryan-7211b3241/" target="_blank">
                                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-none" />
                            </a>
                            <a href="https://x.com/AdityaAryan1408" target="_blank">
                                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-none" />
                            </a>
                        </div>
                        <p className="font-mono text-sm text-gray-400 mt-2">// FULL STACK ENGINEER</p>
                        <p className="font-mono text-sm text-gray-400">// BASED IN INDIA</p>
                    </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col gap-6 stats-trigger opacity-0 translate-y-10">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="relative border border-white/20 p-5 hover:bg-white/5 transition-all group cursor-none">
                            <p className="font-mono text-[10px] text-gray-500 mb-2 group-hover:text-neon-lime uppercase">DSA Problems Solved</p>
                            <div className="flex items-baseline gap-1">
                                <span className="font-display text-4xl lg:text-5xl text-white">
                                    {loading ? "..." : data?.totalSolved}
                                </span>
                                <span className="text-neon-lime font-mono text-lg">+</span>
                            </div>
                            <div className="absolute left-0 bottom-full mb-2 w-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-[#0a0a0a] border border-neon-lime p-3 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                                    <div className="space-y-1">
                                        {data?.platforms
                                            .filter(p => p.name !== "GitHub")
                                            .map((p) => (
                                                <div key={p.name} className="flex justify-between items-center border-b border-white/10 pb-1">
                                                    <span className="font-mono text-[9px] text-gray-400">{p.name}</span>
                                                    <span className="font-mono text-xs text-neon-lime">{p.count}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-white/20 p-5 hover:bg-white/5 transition-all group">
                            <p className="font-mono text-[10px] text-gray-500 mb-2 group-hover:text-neon-lime uppercase">GitHub Commits</p>
                            <div className="flex items-baseline gap-1">
                                <span className="font-display text-4xl lg:text-5xl text-white">
                                    {loading ? "..." : data?.platforms.find(p => p.name === 'GitHub')?.count || 0}
                                </span>
                            </div>
                        </div>

                        <div onClick={scrollToProjects} className="border border-white/20 p-5 hover:bg-white/5 transition-all group cursor-none relative overflow-hidden">
                            <p className="font-mono text-[10px] text-gray-500 mb-2 group-hover:text-neon-lime uppercase">Projects worked on</p>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="font-display text-4xl lg:text-5xl text-white">
                                    {loading ? "..." : data?.platforms.find(p => p.name === 'GitHub')?.repoCount || 0}
                                </span>
                                <FolderGit2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 group-hover:text-neon-lime transition-colors ml-1" />
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/20 p-5 flex flex-col gap-4 group hover:border-neon-lime/50 transition-colors w-full">
                        <div className="flex justify-between items-center relative z-20">
                            <div className="flex items-center gap-3">
                                <p className="font-mono text-xs text-gray-500">ACTIVITY_LOG_</p>
                                {isScrollable && (
                                    <ArrowRight
                                        className={clsx(
                                            "w-4 h-4 text-neon-lime transition-transform duration-500",
                                            scrollDirection === 'left' ? "rotate-180" : "animate-pulse"
                                        )}
                                    />
                                )}
                            </div>

                            <div className="flex gap-4 font-mono text-xs">
                                {YEARS.map((year) => (
                                    <button key={year} onClick={() => setSelectedYear(year)} className={clsx("transition-colors", selectedYear === year ? "text-neon-lime underline decoration-2 underline-offset-4 decoration-neon-lime" : "text-gray-600 hover:text-white")}>
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={() => { handleMouseLeave(); handleMouseUp(); }}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMoveDrag}
                            className={clsx(
                                "flex gap-4 overflow-x-auto pb-4 scrollbar-hide relative select-none",
                                isDragging ? "cursor-none" : "cursor-none"
                            )}
                        >
                            {loading ? (
                                <p className="font-mono text-xs text-gray-500 p-4">Syncing databases...</p>
                            ) : calendarData.length > 0 ? (
                                calendarData.map(({ month, days }) => (
                                    <div key={month} className="flex flex-col gap-2 min-w-max pointer-events-none">
                                        <span className="text-[10px] font-mono text-gray-500 font-bold">{month}</span>
                                        <div className="grid grid-rows-7 grid-flow-col gap-1 pointer-events-auto">
                                            {days.map((day, idx) => (
                                                <div
                                                    key={idx}
                                                    onMouseEnter={(e) => handleMouseEnter(e, day.date, day.count)}
                                                    onMouseLeave={handleMouseLeave}
                                                    className="w-2 h-2 md:w-3 md:h-3 rounded-[1px] hover:scale-125 hover:shadow-[0_0_5px_#ccff00] transition-all duration-200"
                                                    style={{
                                                        backgroundColor: '#ccff00',
                                                        opacity: day.count === 0 ? 0.1 : 0.2 + (day.intensity * 0.2)
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="font-mono text-xs text-gray-500 p-4">No data found for {selectedYear}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {data?.platforms
                            .filter(p => ["LeetCode", "CodeForces", "CodeChef"].includes(p.name))
                            .map((p) => (
                                <a
                                    key={p.name}
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/20 p-4 flex flex-col justify-between hover:border-neon-lime/50 transition-colors group cursor-none"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <img
                                            src={`https://cdn.simpleicons.org/${PLATFORM_ICONS[p.name]}/white`}
                                            alt={p.name}
                                            className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
                                        />
                                        <span className="font-mono text-[10px] text-gray-500 uppercase">{p.name}</span>
                                    </div>
                                    <div className="font-display text-xl text-white group-hover:text-neon-lime transition-colors">
                                        {p.ranking || "UNRATED"}
                                    </div>
                                </a>
                            ))
                        }
                    </div>

                    <div className="border border-white/20 p-5 hover:border-neon-lime/50 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <p className="font-mono text-xs text-gray-500">ARSENAL_</p>
                            <div className="h-[1px] bg-white/10 flex-grow"></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {SKILLS.map((skill) => (
                                <div key={skill.name} className="flex items-center gap-2 p-2 border border-white/5 bg-white/5 rounded-sm hover:bg-white/10 hover:border-neon-lime/30 transition-all group cursor-none">
                                    <img src={`https://cdn.simpleicons.org/${skill.icon}/white`} alt={skill.name} className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <span className="font-mono text-[10px] text-gray-400 group-hover:text-neon-lime transition-colors">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}