export default function MarqueeBreak() {
    return (
        <div className="py-12 bg-neon-lime text-black border-y-4 border-black transform -skew-y-2 relative z-20 overflow-hidden mt-12 mb-24">
            <div className="marquee-container">
                <div className="marquee-content font-display text-6xl md:text-8xl uppercase leading-none whitespace-nowrap">
                    FRONTEND — BACKEND — GENAI — DEVOPS — FRONTEND — BACKEND — GENAI — DEVOPS —
                    FRONTEND — BACKEND — GENAI — DEVOPS — FRONTEND — BACKEND — GENAI — DEVOPS —
                </div>
            </div>
        </div>
    );
}