import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="absolute top-0 w-full p-6 flex justify-between items-start z-50 mix-blend-difference text-white">
            <div>
                <h1 className="font-display text-4xl leading-none">
                    AA<span className="text-neon-lime">.</span>
                </h1>
                <p className="text-xs mt-1 opacity-70">EST. 2002</p>
            </div>
            <div className="flex flex-col text-right text-xs gap-1 font-mono">
                <Link href="#work" className="hover:text-neon-lime transition-colors cursor-none">
                    [ WORK ]
                </Link>
                <Link href="#about" className="hover:text-neon-lime transition-colors cursor-none">
                    [ ABOUT ]
                </Link>
                <Link href="#contact" className="hover:text-neon-lime transition-colors cursor-none">
                    [ CONTACT ]
                </Link>
            </div>
        </nav>
    );
}