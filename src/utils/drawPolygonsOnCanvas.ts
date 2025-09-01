// drawPolygonsOnCanvas.ts
export type RFPoint = { x: number; y: number };
export type RFInstance = {
    class?: string;
    class_id?: number;
    confidence?: number;
    bbox_xyxy?: number[];
    /** Either provide polygons (multiple rings) ... */
    polygons?: RFPoint[][];
    /** ...or a single points ring */
    points?: RFPoint[];
};

export type SegResponse = {
    width: number;
    height: number;
    instances: RFInstance[];
    /** "normalized" means coordinates are in [0,1]; "absolute" are in pixels */
    meta?: { format?: "normalized" | "absolute" };
};

/**
 * Draws polygon masks on a white canvas, then draws the original image clipped to those polygons.
 * @param base64WithPrefix - e.g. "data:image/jpeg;base64,...."
 * @param seg - segmentation response
 * @returns base64 string WITHOUT the "data:image/..." prefix
 */
export function drawPolygonsOnCanvas(
    base64WithPrefix: string,
    seg: SegResponse
): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            const W = img.width;
            const H = img.height;

            if (!seg || !Array.isArray(seg.instances) || seg.instances.length === 0) {
                // return the original image data (without prefix) if no polygons
                return resolve(base64WithPrefix.split(",")[1] || "");
            }

            const normalized = seg.meta?.format !== "absolute";

            const canvas = document.createElement("canvas");
            canvas.width = W;
            canvas.height = H;

            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(base64WithPrefix.split(",")[1] || "");

            // white background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, W, H);

            // build a single path containing all rings (supports holes if provided separately)
            ctx.save();
            ctx.beginPath();

            let drewAnyPath = false;

            for (const inst of seg.instances) {
                // normalize to an array of rings
                const rings: RFPoint[][] | undefined = inst.polygons
                    ? inst.polygons
                    : inst.points
                        ? [inst.points]
                        : undefined;

                if (!rings) continue;

                for (const ring of rings) {
                    if (!ring || ring.length < 3) continue;

                    const first = ring[0];
                    const startX = normalized ? first.x * W : first.x;
                    const startY = normalized ? first.y * H : first.y;
                    ctx.moveTo(startX, startY);

                    for (let i = 1; i < ring.length; i++) {
                        const p = ring[i];
                        const x = normalized ? p.x * W : p.x;
                        const y = normalized ? p.y * H : p.y;
                        ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    drewAnyPath = true;
                }
            }

            if (drewAnyPath) {
                // nonzero fill rule to keep overlapping shapes intuitive
                ctx.clip("nonzero");
            }

            // draw the original image within the clip
            ctx.drawImage(img, 0, 0, W, H);
            ctx.restore();

            const out = canvas.toDataURL("image/jpeg").split(",")[1] || "";
            resolve(out);
        };

        img.onerror = () => resolve(base64WithPrefix.split(",")[1] || "");
        img.src = base64WithPrefix;
    });
}
