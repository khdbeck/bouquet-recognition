export type FlowerAttributes = {
    synonyms: string[];
    shortDesc: string;
    meaning: string[];
};

export const flowerData: Record<string, FlowerAttributes> = {
    aster: {
        synonyms: ["vibrant Aster", "delicate Aster", "starry Aster", "wild Aster", "charming Aster"],
        shortDesc: "Asters add a star-like bloom that brightens any bouquet.",
        meaning: ["patience", "elegance"],
    },
    carnation: {
        synonyms: ["frilly Carnation", "soft Carnation", "ruffled Carnation", "sweet Carnation", "classic Carnation"],
        shortDesc: "Carnations offer layered ruffled petals and lasting charm.",
        meaning: ["love", "fascination"],
    },
    chamomile: {
        synonyms: ["cheerful Chamomile", "sunny Chamomile", "gentle Chamomile", "calm Chamomile", "wild Chamomile"],
        shortDesc: "Chamomile lends a gentle, soothing presence with daisy-like heads.",
        meaning: ["rest", "peacefulness"],
    },
    chrysanthemum: {
        synonyms: ["bold Chrysanthemum", "radiant Chrysanthemum", "sunburst Chrysanthemum", "cheerful Chrysanthemum", "grand Chrysanthemum"],
        shortDesc: "Chrysanthemums showcase vibrant color and strong seasonal flair.",
        meaning: ["longevity", "joy"],
    },
    dahlia: {
        synonyms: ["stunning Dahlia", "intricate Dahlia", "vivid Dahlia", "layered Dahlia", "decorative Dahlia"],
        shortDesc: "Dahlias wow with layered petals and vivid textures.",
        meaning: ["elegance", "creativity"],
    },
    eustoma: {
        synonyms: ["elegant Eustoma", "refined Eustoma", "gentle Eustoma", "graceful Eustoma", "pastel Eustoma"],
        shortDesc: "Eustoma (Lisianthus) flowers have soft, rose-like pastel petals.",
        meaning: ["appreciation", "gratitude"],
    },
    gerbera: {
        synonyms: ["vibrant Gerbera", "happy Gerbera", "daisy-like Gerbera", "bold Gerbera", "cheery Gerbera"],
        shortDesc: "Gerberas bring bright, large daisy-like blossoms and a cheerful vibe.",
        meaning: ["innocence", "purity", "cheerfulness"],
    },
    gladiolus: {
        synonyms: ["towering Gladiolus", "sword-like Gladiolus", "regal Gladiolus", "bold Gladiolus", "dramatic Gladiolus"],
        shortDesc: "Gladioli add height and drama with tall spires of blossoms.",
        meaning: ["faithfulness", "honor"],
    },
    hydrangea: {
        synonyms: ["lush Hydrangea", "voluminous Hydrangea", "cloud-like Hydrangea", "rich Hydrangea", "layered Hydrangea"],
        shortDesc: "Hydrangeas form large, cloud-like clusters in soft or bold colors.",
        meaning: ["gratitude", "abundance"],
    },
    lily: {
        synonyms: ["graceful Lily", "regal Lily", "pure Lily", "noble Lily", "elegant Lily"],
        shortDesc: "Lilies have a signature trumpet shape and a refined, dramatic aura.",
        meaning: ["purity", "rebirth"],
    },
    mattiola: {
        synonyms: ["fragrant Matthiola", "soft-stock Mattiola", "sweet-stock Mattiola", "stock flower", "colorful Matthiola"],
        shortDesc: "Also called stock, Mattiola has a sweet fragrance and fluffy spires.",
        meaning: ["lasting beauty", "happy life"],
    },
    orchid: {
        synonyms: ["exotic Orchid", "graceful Orchid", "rare Orchid", "tropical Orchid", "delicate Orchid"],
        shortDesc: "Orchids are prized for their striking shapes and exotic elegance.",
        meaning: ["luxury", "rare beauty"],
    },
    peony: {
        synonyms: ["luxurious Peony", "opulent Peony", "fluffy Peony", "romantic Peony", "lush Peony"],
        shortDesc: "Peonies boast lush, layered petals and a soft, romantic charm.",
        meaning: ["prosperity", "romance"],
    },
    "peony-like rose": {
        synonyms: ["voluminous rose", "peony-styled rose", "lush rose", "garden rose", "layered rose"],
        shortDesc: "A special rose variety with fuller, peony-like petals for added grandeur.",
        meaning: ["love", "luxury"],
    },
    ranunculus: {
        synonyms: ["layered Ranunculus", "whimsical Ranunculus", "petal-rich Ranunculus", "bold Ranunculus", "romantic Ranunculus"],
        shortDesc: "Ranunculi have multiple delicate petals for a richly textured bloom.",
        meaning: ["attraction", "radiant charm"],
    },
    rose: {
        synonyms: ["classic Rose", "timeless Rose", "romantic Rose", "velvety Rose", "blooming Rose"],
        shortDesc: "Roses are a universal symbol of love with elegant petals and sweet fragrance.",
        meaning: ["love", "passion"],
    },
    tulip: {
        synonyms: ["charming Tulip", "colorful Tulip", "elegant Tulip", "vivid Tulip", "springtime Tulip"],
        shortDesc: "Tulips have a simple, graceful form that symbolizes perfect love.",
        meaning: ["affection", "new beginnings"],
    },
};
