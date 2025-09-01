

export function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function capitalize(word: string) {
    if (!word) return "";
    return word[0].toUpperCase() + word.slice(1);
}


export function joinMeanings(meanings: string[]): string {
    if (meanings.length === 0) return "special meaning";
    if (meanings.length === 1) return meanings[0];
    return (
        meanings.slice(0, -1).join(", ") + " and " + meanings[meanings.length - 1]
    );
}
interface RGBRange {
    name: string;
    r: [number, number];
    g: [number, number];
    b: [number, number];
}

const colorRanges: RGBRange[] = [
    { name: "red", r: [150, 255], g: [0, 100], b: [0, 100] },
    { name: "pink", r: [200, 255], g: [100, 200], b: [150, 210] },
    { name: "white", r: [200, 255], g: [200, 255], b: [200, 255] },
    { name: "yellow", r: [200, 255], g: [200, 255], b: [0, 100] },
    { name: "orange", r: [200, 255], g: [100, 200], b: [0, 100] },
    { name: "purple", r: [100, 180], g: [0, 80], b: [100, 200] },
    { name: "blue", r: [0, 100], g: [0, 150], b: [150, 255] },
    { name: "green", r: [0, 100], g: [100, 255], b: [0, 100] },
    { name: "peach", r: [240, 255], g: [180, 220], b: [150, 190] },
    { name: "lavender", r: [200, 240], g: [200, 240], b: [240, 255] },
    { name: "burgundy", r: [80, 140], g: [0, 50], b: [30, 70] },
];
export const colorMeanings: Record<string, string[]> = {
    red: ["love", "passion"],
    pink: ["affection", "grace"],
    white: ["purity", "peace"],
    yellow: ["joy", "friendship"],
    orange: ["warmth", "energy"],
    purple: ["royalty", "mystery"],
    blue: ["trust", "tranquility"],
    green: ["harmony", "renewal"],
    peach: ["gratitude", "sincerity"],
    lavender: ["serenity", "elegance"],
    burgundy: ["deep love", "sophistication"],
    unknown: ["uniqueness", "mystery"],
};

export function getColorNameFromRGB(rgb: number[]): string {
    const [r, g, b] = rgb;

    for (const color of colorRanges) {
        if (
            r >= color.r[0] && r <= color.r[1] &&
            g >= color.g[0] && g <= color.g[1] &&
            b >= color.b[0] && b <= color.b[1]
        ) {
            return color.name;
        }
    }

    let minDist = Infinity;
    let closest = "unknown";
    for (const color of colorRanges) {
        const avgR = (color.r[0] + color.r[1]) / 2;
        const avgG = (color.g[0] + color.g[1]) / 2;
        const avgB = (color.b[0] + color.b[1]) / 2;
        const dist = Math.sqrt((r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2);
        if (dist < minDist) {
            minDist = dist;
            closest = color.name;
        }
    }

    return closest;
}

