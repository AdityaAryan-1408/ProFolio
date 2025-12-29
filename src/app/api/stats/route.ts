import { NextResponse } from "next/server";
import {
    fetchLeetCode,
    fetchGitHub,
    fetchCodeForces,
    fetchGFG,
    fetchCodeChef,
    fetchHackerRank
} from "@/lib/platforms";

export const dynamic = 'force-dynamic';

export async function GET() {
    const usernames = {
        leetcode: process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "Aditya_Aryan",
        codeforces: process.env.NEXT_PUBLIC_CODEFORCES_USERNAME || "AdityaAryan-1408",
        codechef: process.env.NEXT_PUBLIC_CODECHEF_USERNAME || "aryan_aditya14",
        gfg: process.env.NEXT_PUBLIC_GFG_USERNAME || "aryanaditya1486",
        hackerrank: process.env.NEXT_PUBLIC_HACKERRANK_USERNAME || "aryanaditya1486",
        github: process.env.NEXT_PUBLIC_GITHUB_USERNAME || "AdityaAryan-1408"
    };

    const results = await Promise.allSettled([
        fetchLeetCode(usernames.leetcode),
        fetchGitHub(usernames.github),
        fetchCodeForces(usernames.codeforces),
        fetchGFG(usernames.gfg),
        fetchCodeChef(usernames.codechef),
        fetchHackerRank(usernames.hackerrank)
    ]);

    const stats = results
        .map(r => r.status === 'fulfilled' ? r.value : null)
        .filter(Boolean);

    let grandTotal = 0;
    const mergedHeatmap: Record<string, number> = {};
    const platformBreakdown: any[] = [];

    stats.forEach(stat => {
        if (!stat) return;

        if (stat.platform !== "GitHub") {
            grandTotal += stat.totalSolved;
        }

        platformBreakdown.push({
            name: stat.platform,
            count: stat.totalSolved,
            url: stat.profileUrl,
            ranking: stat.ranking || null,
            repoCount: stat.repoCount || 0
        });

        if (stat.heatmap) {
            Object.entries(stat.heatmap).forEach(([date, count]) => {
                mergedHeatmap[date] = (mergedHeatmap[date] || 0) + count;
            });
        }
    });

    const heatmapArray = Object.entries(mergedHeatmap)
        .map(([date, count]) => ({
            date,
            count,
            intensity: count > 10 ? 4 : count > 5 ? 3 : count > 2 ? 2 : 1
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
        totalSolved: grandTotal,
        platforms: platformBreakdown,
        heatmap: heatmapArray
    });
}