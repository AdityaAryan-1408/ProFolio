"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Copy, Check, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ContactFooter() {
    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [formStatus, setFormStatus] = useState<"IDLE" | "SENDING" | "SENT">("IDLE");

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".footer-title-reveal", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
            gsap.to(modalRef.current, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
            gsap.fromTo(".modal-content",
                { scale: 0.95, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
            );
        } else {
            document.body.style.overflow = "unset";
            gsap.to(modalRef.current, { opacity: 0, pointerEvents: "none", duration: 0.3 });
        }
    }, [isModalOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText("aditya.aryan@example.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("SENDING");

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("user_name") as string;
        const message = formData.get("message") as string;

        const subject = `Portfolio Contact from ${name}`;
        const body = `Hi Aditya,\n\n${message}\n\nBest,\n${name}`;

        const mailtoLink = `mailto:aryanaditya1486@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        setTimeout(() => {
            window.location.href = mailtoLink;

            setFormStatus("SENT");
            setTimeout(() => {
                setIsModalOpen(false);
                setFormStatus("IDLE");
            }, 3000);
        }, 1500);
    };

    return (
        <section
            ref={containerRef}
            id="contact"
            className="min-h-[80vh] flex flex-col justify-between px-6 md:px-12 py-12 bg-neon-lime text-black mt-24 relative z-10"
        >
            <div
                ref={modalRef}
                className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md opacity-0 pointer-events-none flex justify-center items-center text-white px-4"
                onClick={() => setIsModalOpen(false)}
            >
                <div
                    className="modal-content bg-[#0a0a0a] border border-neon-lime p-8 w-full max-w-lg relative shadow-[0_0_50px_rgba(204,255,0,0.15)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-none font-mono text-xl hover:rotate-90 duration-300"
                    >
                        ✕
                    </button>

                    <h3 className="font-display text-4xl uppercase mb-1">Initialize <span className="text-neon-lime">Link</span></h3>
                    <p className="text-xs text-gray-500 mb-8 font-mono">SECURE TRANSMISSION CHANNEL //</p>

                    {formStatus === "SENT" ? (
                        <div className="py-12 text-center flex flex-col items-center justify-center gap-4">
                            <CheckCircle2 className="w-16 h-16 text-neon-lime animate-bounce" />
                            <p className="font-mono text-neon-lime text-lg">CLIENT LAUNCHED</p>
                            <p className="font-mono text-gray-500 text-xs">Please click "Send" in your email app.</p>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-6 font-mono text-sm" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-neon-lime tracking-widest">IDENTIFIER [NAME]</label>
                                <input name="user_name" type="text" className="bg-white/5 border border-white/10 p-4 text-white focus:border-neon-lime focus:outline-none transition-colors placeholder:text-gray-700" placeholder="ENTER NAME_" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-neon-lime tracking-widest">COORDINATES [EMAIL]</label>
                                <input name="user_email" type="email" className="bg-white/5 border border-white/10 p-4 text-white focus:border-neon-lime focus:outline-none transition-colors placeholder:text-gray-700" placeholder="ENTER EMAIL_" required />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-neon-lime tracking-widest">PAYLOAD [MESSAGE]</label>
                                <textarea name="message" rows={4} className="bg-white/5 border border-white/10 p-4 text-white focus:border-neon-lime focus:outline-none transition-colors resize-none placeholder:text-gray-700" placeholder="ENTER MESSAGE DATA..." required></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus === "SENDING"}
                                className="bg-neon-lime text-black font-bold py-4 mt-2 hover:bg-white transition-colors uppercase tracking-wider cursor-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {formStatus === "SENDING" ? "[ PREPARING PACKET... ]" : "[ OPEN CLIENT ]"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-start border-b border-black/20 pb-8 pt-12 footer-title-reveal">
                <h2 className="font-display text-6xl md:text-9xl uppercase leading-[0.85] tracking-tight">
                    Let's<br />Talk
                </h2>
                <div className="text-right font-mono text-xs hidden md:block leading-relaxed opacity-70 text-black">
                    <p>AVAILABLE FOR FREELANCE</p>
                    <p>EST. 2025</p>
                    <p>INDIA</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end pb-4 mt-12">
                <div className="flex flex-col gap-8 items-start">

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-neon-lime font-display text-2xl md:text-4xl border-2 border-black px-10 py-5 hover:bg-transparent hover:text-black transition-all duration-300 uppercase tracking-wide cursor-none relative overflow-hidden group shadow-[5px_5px_0px_0px_rgba(0,0,0,0.3)]"
                    >
                        <span className="relative z-10">Contact Me</span>
                    </button>

                    <div className="flex items-center gap-3 font-mono text-sm group text-black">
                        <a href="mailto:aditya.aryan@example.com" className="underline decoration-1 underline-offset-4 hover:decoration-2 transition-all cursor-none uppercase font-bold">
                            OR EMAIL: aryanaditya1486.com
                        </a>
                        <button onClick={handleCopy} className="hover:scale-110 transition-transform cursor-none opacity-60 group-hover:opacity-100" title="Copy Email">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 font-mono text-sm mt-12 md:mt-0 font-bold text-black">
                    <a href="https://x.com/AdityaAryan1408" target="_blank" className="hover:underline decoration-2 underline-offset-4 cursor-none">TWITTER</a>
                    <a href="https://github.com/AdityaAryan-1408" target="_blank" className="hover:underline decoration-2 underline-offset-4 cursor-none">GITHUB</a>
                    <a href="https://www.linkedin.com/in/aditya-aryan-7211b3241/" target="_blank" className="hover:underline decoration-2 underline-offset-4 cursor-none">LINKEDIN</a>
                </div>
            </div>

            <div className="absolute bottom-4 left-6 md:left-12 text-[10px] font-mono opacity-40 text-black">
                © 2025 ADITYA ARYAN. ALL RIGHTS RESERVED.
            </div>
        </section>
    );
}
