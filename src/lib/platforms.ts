import axios from "axios";
import { unstable_cache } from 'next/cache';

export interface PlatformStats {
    platform: string;
    username: string;
    totalSolved: number;
    ranking?: string;
    repoCount?: number;
    heatmap: Record<string, number>;
    profileUrl: string;
}

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
};

async function fetchLeetCode_Internal(username: string): Promise<PlatformStats | null> {
    if (!username) return null;
    const query = `
    query userStats($username: String!) {
      matchedUser(username: $username) {
        submitStats { acSubmissionNum { difficulty count } }
        submissionCalendar
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
      }
    }
  `;
    try {
        const response = await axios.post("https://leetcode.com/graphql", { query, variables: { username } });
        const data = response.data.data;
        const matched = data.matchedUser;

        if (!matched) return null;

        const totalSolved = matched.submitStats.acSubmissionNum.find((i: any) => i.difficulty === "All")?.count || 0;
        const rawCalendar = JSON.parse(matched.submissionCalendar || "{}");
        const heatmap: Record<string, number> = {};
        Object.keys(rawCalendar).forEach((ts) => {
            const date = new Date(parseInt(ts) * 1000).toISOString().split("T")[0];
            heatmap[date] = rawCalendar[ts];
        });

        let rankingStr = "Unrated";
        const contestRating = Math.round(data.userContestRanking?.rating || 0);

        if (contestRating > 0) {
            rankingStr = `Rating: ${contestRating}`;
        }

        return {
            platform: "LeetCode",
            username,
            totalSolved,
            ranking: rankingStr,
            heatmap,
            profileUrl: `https://leetcode.com/${username}`
        };
    } catch (e) { console.error("LC Error", e); return null; }
}

async function fetchGitHub_Internal(username: string): Promise<PlatformStats | null> {
    if (!username) return null;
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error("GITHUB_TOKEN MISSING");
        return null;
    }

    const query = `
    query($username: String!) {
      user(login: $username) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 1) {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
        }
      }
    }
  `;
    try {
        const response = await axios.post("https://api.github.com/graphql", { query, variables: { username } }, { headers: { Authorization: `Bearer ${token}` } });
        const userData = response.data.data.user;
        const cal = userData.contributionsCollection.contributionCalendar;
        const repoCount = userData.repositories.totalCount;

        const heatmap: Record<string, number> = {};
        cal.weeks.forEach((w: any) => w.contributionDays.forEach((d: any) => { if (d.contributionCount > 0) heatmap[d.date] = d.contributionCount; }));

        return {
            platform: "GitHub",
            username,
            totalSolved: cal.totalContributions,
            repoCount: repoCount,
            heatmap,
            profileUrl: `https://github.com/${username}`
        };
    } catch (e) { console.error("GH Error", e); return null; }
}

async function fetchCodeForces_Internal(username: string): Promise<PlatformStats | null> {
    if (!username) return null;
    try {
        const infoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const result = infoRes.data.result[0];

        const rating = result.rating || 0;
        const rank = result.rank ? result.rank : "Unrated";
        const capitalizedRank = rank.charAt(0).toUpperCase() + rank.slice(1);

        const subRes = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
        const submissions = subRes.data.result;

        const heatmap: Record<string, number> = {};
        const solvedSet = new Set<string>();

        submissions.forEach((sub: any) => {
            if (sub.verdict === "OK") {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedSet.add(problemId);
                const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split("T")[0];
                heatmap[date] = (heatmap[date] || 0) + 1;
            }
        });

        let rankingStr = rank !== "Unrated"
            ? `Rating: ${rating} (${capitalizedRank})`
            : (rating > 0 ? `Rating: ${rating}` : "Unrated");

        return {
            platform: "CodeForces",
            username,
            totalSolved: solvedSet.size,
            ranking: rankingStr,
            heatmap,
            profileUrl: `https://codeforces.com/profile/${username}`
        };
    } catch (e) { console.error("CF Error", e); return null; }
}

async function fetchGFG_Internal(username: string): Promise<PlatformStats | null> {
    if (!username) return null;

    const solved = 385
    
    return {
        platform: "GeeksforGeeks",
        username,
        totalSolved: solved,
        heatmap: {},
        profileUrl: `https://www.geeksforgeeks.org/user/${username}/`
    };
}


async function fetchCodeChef_Internal(username: string): Promise<PlatformStats | null> {
    if (!username) return null;
    try {
        const url = `https://www.codechef.com/users/${username}`;
        const { data } = await axios.get(url, { headers: HEADERS });

        let totalSolved = 0;
        const solvedMatch = data.match(/Total Problems Solved:\s*(\d+)/);
        if (solvedMatch && solvedMatch[1]) totalSolved = parseInt(solvedMatch[1], 10);

        let rankingStr = "Unrated";
        const ratingMatch = data.match(/class="rating-number"[^>]*?>(\d+)</);

        if (ratingMatch && ratingMatch[1]) {
            const rating = parseInt(ratingMatch[1], 10);
            const starMatch = data.match(/class="rating-star"[^>]*?>\s*<span>(.*?)<\/span>/);
            const stars = starMatch ? starMatch[1] : "";

            rankingStr = stars ? `${stars} (${rating})` : `Rating: ${rating}`;
        }

        return {
            platform: "CodeChef",
            username,
            totalSolved,
            ranking: rankingStr,
            heatmap: {},
            profileUrl: url
        };

    } catch (error) {
        console.error(`Error fetching CodeChef for ${username}:`, (error as Error).message);
        return { platform: "CodeChef", username, totalSolved: 0, heatmap: {}, profileUrl: `https://www.codechef.com/users/${username}` };
    }
}

async function fetchHackerRank_Internal(username: string): Promise<PlatformStats | null> {
    return {
        platform: "HackerRank",
        username,
        totalSolved: 121,
        heatmap: {},
        profileUrl: `https://www.hackerrank.com/${username}`
    };
}


const CACHE_DURATION = 86400;

export const fetchLeetCode = unstable_cache(
    async (username: string) => fetchLeetCode_Internal(username),
    ['leetcode-stats-v2'], { revalidate: CACHE_DURATION }
);

export const fetchGitHub = unstable_cache(
    async (username: string) => fetchGitHub_Internal(username),
    ['github-stats-v5'],
    { revalidate: CACHE_DURATION }
);
export const fetchCodeForces = unstable_cache(
    async (username: string) => fetchCodeForces_Internal(username),
    ['codeforces-stats-v3'],
    { revalidate: CACHE_DURATION }
);

export const fetchGFG = unstable_cache(
    async (username: string) => fetchGFG_Internal(username),
    ['gfg-stats-manual-v2'], { revalidate: CACHE_DURATION }
);

export const fetchCodeChef = unstable_cache(
    async (username: string) => fetchCodeChef_Internal(username),
    ['codechef-stats-v2'], { revalidate: CACHE_DURATION }
);

export const fetchHackerRank = unstable_cache(
    async (username: string) => fetchHackerRank_Internal(username),
    ['hackerrank-stats-static'], { revalidate: CACHE_DURATION }
);