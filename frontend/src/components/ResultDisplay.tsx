import React, { useEffect, useRef } from "react";

export interface SinglePrediction {
  name: string;
  confidence: number;
  bbox?: number[];
}

interface ResultDisplayProps {
  image: string;
  predictions: SinglePrediction[];
  isLoading: boolean;
  error?: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, predictions, isLoading, error }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgElement = new Image();
    imgElement.onload = () => {
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0);

      predictions.forEach((pred) => {
        if (pred.bbox && pred.bbox.length === 4) {
          const [x1, y1, x2, y2] = pred.bbox;
          const width = x2 - x1;
          const height = y2 - y1;

          ctx.strokeStyle = "#00BFFF";
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, width, height);

          const label = `${pred.name} (${Math.round(pred.confidence * 100)}%)`;
          ctx.font = "16px Arial";
          const textWidth = ctx.measureText(label).width;

          ctx.fillStyle = "rgba(0,191,255,0.3)";
          ctx.fillRect(x1, y1 - 20, textWidth + 4, 20);

          ctx.fillStyle = "#000";
          ctx.fillText(label, x1 + 2, y1 - 5);
        }
      });
    };
    imgElement.src = image;
  }, [image, predictions]);

  const grouped = predictions.reduce((acc: Record<string, { count: number; sumConf: number }>, p) => {
    if (!acc[p.name]) acc[p.name] = { count: 0, sumConf: 0 };
    acc[p.name].count += 1;
    acc[p.name].sumConf += p.confidence;
    return acc;
  }, {});

  const groupedArray = Object.entries(grouped).map(([flower, stats]) => {
    const avgConf = stats.sumConf / stats.count;
    return { flower, avgConf, count: stats.count };
  });

  return (
      <div className="mx-auto mt-6 max-w-3xl">
        {image && (
            <div className="rounded-lg bg-white p-4 shadow">
              {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Analyzing image...</p>
                  </div>
              ) : error ? (
                  <div className="text-center text-red-600 font-medium">{error}</div>
              ) : (
                  <>
                    <canvas ref={canvasRef} className="w-full max-w-full rounded-md border border-gray-200" />
                    {groupedArray.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Detected Flowers (Grouped):</h3>
                          <ul className="space-y-1">
                            {groupedArray.map((item, i) => (
                                <li key={i} className="text-sm text-gray-700">
                                   <strong>{item.flower}</strong> – {item.count}x – {Math.round(item.avgConf * 100)}% confidence avg
                                </li>
                            ))}
                          </ul>
                        </div>
                    )}
                  </>
              )}
            </div>
        )}
      </div>
  );
};

export default ResultDisplay;
