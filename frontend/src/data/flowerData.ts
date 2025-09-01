export type FlowerAttributes = {
    synonyms: string[];
    shortDesc: string;
    meaning: string[];
};

export const flowerData: Record<string, FlowerAttributes> = {
    aster: {
        synonyms: ["vibrant Aster", "delicate Aster"],
        shortDesc: "Asters add a star-like bloom that brightens any bouquet.",
        meaning: ["patience", "elegance"],
    },
    carnation: {
        synonyms: ["classic Carnation", "soft Carnation"],
        shortDesc: "Carnations offer layered ruffled petals and lasting charm.",
        meaning: ["love", "fascination"],
    },
    chamomile: {
        synonyms: ["gentle Chamomile", "sunny Chamomile"],
        shortDesc: "Chamomile lends a gentle, soothing presence with daisy-like heads.",
        meaning: ["calmness", "peacefulness"],
    },
    chrysanthemum: {
        synonyms: ["bold Chrysanthemum", "radiant Chrysanthemum"],
        shortDesc: "Chrysanthemums showcase vibrant color and strong seasonal flair.",
        meaning: ["friendship", "joy", "honesty"],
    },
    dahlia: {
        synonyms: ["stunning Dahlia", "intricate Dahlia"],
        shortDesc: "Dahlias wow with layered petals and vivid textures.",
        meaning: ["elegance", "good taste", "instability"],
    },
    eustoma: {
        synonyms: ["elegant Eustoma", "refined Eustoma"],
        shortDesc: "Eustoma (Lisianthus) flowers have soft, rose-like pastel petals.",
        meaning: ["gratitude", "thoughtfulness"],
    },
    gerbera: {
        synonyms: ["vibrant Gerbera", "happy Gerbera"],
        shortDesc: "Gerberas bring bright, large daisy-like blossoms and a cheerful vibe.",
        meaning: ["innocence", "cheerfulness"],
    },
    gladiolus: {
        synonyms: ["towering Gladiolus", "regal Gladiolus"],
        shortDesc: "Gladioli add height and drama with tall spires of blossoms.",
        meaning: ["strength", "honor"],
    },
    hydrangea: {
        synonyms: ["lush Hydrangea", "voluminous Hydrangea"],
        shortDesc: "Hydrangeas form large, cloud-like clusters in soft or bold colors.",
        meaning: ["gratitude", "understanding"],
    },
    lily: {
        synonyms: ["graceful Lily", "regal Lily"],
        shortDesc: "Lilies have a signature trumpet shape and a refined, dramatic aura.",
        meaning: ["purity", "devotion"],
    },
    mattiola: {
        synonyms: ["fragrant Matthiola", "colorful Matthiola"],
        shortDesc: "Also called stock, Mattiola has a sweet fragrance and fluffy spires.",
        meaning: ["happy life", "bonds of affection"],
    },
    orchid: {
        synonyms: ["exotic Orchid", "delicate Orchid"],
        shortDesc: "Orchids are prized for their striking shapes and exotic elegance.",
        meaning: ["exotic beauty", "strength"],
    },
    peony: {
        synonyms: ["luxurious Peony", "romantic Peony"],
        shortDesc: "Peonies boast lush, layered petals and a soft, romantic charm.",
        meaning: ["prosperity", "good fortune"],
    },
    "peony-like rose": {
        synonyms: ["voluminous rose", "garden rose"],
        shortDesc: "A special rose variety with fuller, peony-like petals for added grandeur.",
        meaning: ["love", "elegance"],
    },
    ranunculus: {
        synonyms: ["layered Ranunculus", "romantic Ranunculus"],
        shortDesc: "Ranunculi have multiple delicate petals for a richly textured bloom.",
        meaning: ["attraction", "radiant charm"],
    },
    rose: {
        synonyms: ["classic Rose", "romantic Rose"],
        shortDesc: "Roses are a universal symbol of love with elegant petals and sweet fragrance.",
        meaning: ["love", "passion", "beauty"],
    },
    tulip: {
        synonyms: ["charming Tulip", "springtime Tulip"],
        shortDesc: "Tulips have a simple, graceful form that symbolizes perfect love.",
        meaning: ["perfect love", "elegance"],
    },
};
