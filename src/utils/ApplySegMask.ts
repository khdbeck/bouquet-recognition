export type RFPoint = { x: number; y: number };
export type RFInstance = {
    class?: string;
    class_id?: number;
    confidence?: number;
    bbox_xyxy?: number[];
    polygons?: RFPoint[][];
    points?: RFPoint[];
};

export type SegResponse = {
    width: number;
    height: number;
    instances: RFInstance[];
    meta?: { format?: "normalized" | "absolute" };
};


export function applySegMask(
    base64WithPrefix: string,
    seg: SegResponse
): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            const W = img.width;
            const H = img.height;

            if (!seg || !Array.isArray(seg.instances) || seg.instances.length === 0) {
                return resolve(base64WithPrefix.split(",")[1] || "");
            }

            const normalized = seg.meta?.format !== "absolute";

            const canvas = document.createElement("canvas");
            canvas.width = W;
            canvas.height = H;

            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(base64WithPrefix.split(",")[1] || "");

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, W, H);

            ctx.save();
            ctx.beginPath();

            let drewAnyPath = false;

            for (const inst of seg.instances) {
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
                ctx.clip("nonzero");
            }

            ctx.drawImage(img, 0, 0, W, H);
            ctx.restore();

            const out = canvas.toDataURL("image/jpeg").split(",")[1] || "";
            resolve(out);
        };

        img.onerror = () => resolve(base64WithPrefix.split(",")[1] || "");
        img.src = base64WithPrefix;
    });
}
