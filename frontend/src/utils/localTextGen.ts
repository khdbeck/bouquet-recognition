
import { flowerData } from "../data/flowerData";
import { pickRandom, capitalize, joinMeanings } from "./textUtils";
import { colorMeanings } from "./textUtils";

export function generateSingleFlowerText(flowerKey: string, colorName?: string): string {
    const entry = flowerData[flowerKey.toLowerCase()];
    if (!entry) return `Unknown flower: ${flowerKey}`;
    const synonym = pickRandom(entry.synonyms);
    const flowerMeaningStr = joinMeanings(entry.meaning);

    let colorMeaningStr = '';
    if (colorName && colorMeanings[colorName]) {
        const colorMeaning = joinMeanings(colorMeanings[colorName]);
        colorMeaningStr = ` Its ${colorName} hue adds symbolism of ${colorMeaning}.`;
    }

    return `The ${synonym} symbolizes ${flowerMeaningStr}.${colorMeaningStr} ${entry.shortDesc}`;
}

export function createRandomBouquetText(
    flowers: string[],
    flowerColorMap?: Record<string, string>
): {
    name: string;
    description: string;
} {
    if (flowers.length === 0) {
        return {
            name: "No Bouquet",
            description: "No flowers detected.",
        };
    }

    const [firstFlower] = flowers;
    const adjectives = [
        "Enchanting",
        "Romantic",
        "Blooming",
        "Graceful",
        "Majestic",
        "Splendid",
    ];
    const adj = pickRandom(adjectives);
    const name = `${adj} ${capitalize(firstFlower)} Bouquet`;

    const lines = flowers.map((fl) => {
        const color = flowerColorMap?.[fl.toLowerCase()];
        return generateSingleFlowerText(fl, color);
    });

    const description = lines.join(" ");
    return { name, description };
}
