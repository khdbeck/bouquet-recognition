import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Hero from './components/Hero';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import UseCases from './components/UseCases';
import { createRandomBouquetText } from './utils/localTextGen';
import { getColorNameFromRGB } from './utils/textUtils';
import { drawPolygonsOnCanvas } from './utils/drawPolygonsOnCanvas';
import type { SinglePrediction } from './components/ResultDisplay';

/* ---------- Color helpers (adapted from your Python function) ---------- */
function clamp255(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex(rgb: number[]): string {
  const [r, g, b] = [clamp255(rgb[0] ?? 0), clamp255(rgb[1] ?? 0), clamp255(rgb[2] ?? 0)];
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function hexToRgb(hex: string): number[] {
  let h = hex.trim();
  if (h.startsWith('#')) h = h.slice(1);
  if (h.length !== 6) return [0, 0, 0];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function complementaryColorHex(my_hex: string): string {
  let h = my_hex;
  if (h[0] === '#') h = h.slice(1);
  const r = 255 - parseInt(h.slice(0, 2), 16);
  const g = 255 - parseInt(h.slice(2, 4), 16);
  const b = 255 - parseInt(h.slice(4, 6), 16);
  const toHex = (x: number) => x.toString(16).toUpperCase().padStart(2, '0');
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}
/* ---------------------------------------------------------------------- */

function applyWhiteBackgroundMask(
    base64: string,
    maskPoints: { x: number; y: number }[],
    width: number,
    height: number
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      maskPoints.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, 0, 0);
      ctx.restore();

      const finalBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
      resolve(finalBase64);
    };
    img.src = `data:image/jpeg;base64,${base64}`;
  });
}

function base64ToBlob(base64: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays: number[] = [];
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }
  return new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' });
}

const App: React.FC = () => {
  const [confidence, setConfidence] = useState(0.5);
  const [overlap, setOverlap] = useState(0.45);
  const [fillMissing, setFillMissing] = useState(false);
  const [applyPrefilter, setApplyPrefilter] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<SinglePrediction[]>([]);
  const [avgColors, setAvgColors] = useState<Record<string, number[]>>({});
  const [bouquetColor, setBouquetColor] = useState<number[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'detect' | 'segment-then-detect'>('detect');

  const handleImageSelect = (file: File) => {
    setError(null);
    setIsAnalyzing(true);

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        let imageBase64WithPrefix = reader.result as string;
        let base64 = imageBase64WithPrefix.split(',')[1];

        if (mode === 'segment-then-detect') {
          const segForm = new FormData();
          segForm.append('file', base64ToBlob(base64), 'image.jpg');

          const segRes = await axios.post(
              `http://127.0.0.1:8000/segment/?prefilter=${applyPrefilter}`,
              segForm,
              {
                headers: {
                  'x-api-key': 'myresearchapikey',
                  'Content-Type': 'multipart/form-data',
                },
              }
          );

          const segData = segRes.data;

          if (Array.isArray(segData.instances) && segData.instances.length > 0) {
            base64 = await drawPolygonsOnCanvas(`data:image/jpeg;base64,${base64}`, segData);
            imageBase64WithPrefix = `data:image/jpeg;base64,${base64}`;
          }
        }

        const detectForm = new FormData();
        detectForm.append('file', base64ToBlob(base64), 'image.jpg');

        const detectRes = await axios.post(
            `http://127.0.0.1:8000/predict/?confidence=${confidence}&overlap=${overlap}&fill_missing=${fillMissing}&prefilter=${applyPrefilter}`,
            detectForm,
            {
              headers: {
                'x-api-key': 'myresearchapikey',
                'Content-Type': 'multipart/form-data',
              },
            }
        );

        const result = detectRes.data;

        const detailed: SinglePrediction[] = (result?.detailed || []).map((p: any) => ({
          name: p.name ?? p.class ?? 'unknown',
          confidence: p.confidence ?? p.score ?? p.probability ?? 0,
          bbox: p.box ?? p.bbox ?? p.xywh ?? p.xyxy,
          dominant_color: p.dominant_color,
          complementary_color: p.complementary_color,
          ...p,
        }));

        if (detailed.length > 0) {
          setPredictions(detailed);
          setAvgColors(result.bounding_box_avcolor || {});
          setBouquetColor(result.bouquet_color || null);
        } else {
          setError('No flowers detected.');
          setPredictions([]);
          setAvgColors({});
          setBouquetColor(null);
        }

        setSelectedImage(imageBase64WithPrefix);
      } catch (err) {
        console.error('❌ API error:', err);
        setError('Something went wrong with the API.');
        setPredictions([]);
        setAvgColors({});
        setBouquetColor(null);
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.onerror = () => {
      setError('Error reading the file.');
      setIsAnalyzing(false);
    };

    reader.readAsDataURL(file);
  };

  const flowerClasses = Array.from(
      new Set(predictions.map((p) => p.name?.toLowerCase() || ''))
  ).filter((n) => n);

  const flowerColorMap: Record<string, string> = {};
  Object.entries(avgColors).forEach(([name, rgb]) => {
    const colorName = getColorNameFromRGB(rgb);
    flowerColorMap[name.toLowerCase()] = colorName;
  });

  const bouquetText = createRandomBouquetText(flowerClasses, flowerColorMap);

  const ColorSwatch: React.FC<{ rgb: number[]; label?: string; hexRight?: boolean }> = ({ rgb, label, hexRight }) => {
    const hex = rgbToHex(rgb);
    return (
        <div className="flex items-center gap-2">
          {label && <span className="text-sm">{label}</span>}
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: `rgb(${rgb.map(clamp255).join(',')})` }} />
          <code className="text-xs text-gray-600">{hexRight ? `#${hex}` : ''}</code>
        </div>
    );
  };

  const renderAvgAndComplementary = (label: string, rgb: number[]) => {
    const avgHex = rgbToHex(rgb);
    const compHex = complementaryColorHex(avgHex);
    const compRgb = hexToRgb(compHex);
    const avgName = getColorNameFromRGB(rgb);
    const compName = getColorNameFromRGB(compRgb);
    return (
        <li key={label} className="flex items-center justify-between gap-4 py-1">
          <div className="flex items-center gap-2">
            <span className="min-w-28 font-medium">{label}</span>
            <ColorSwatch rgb={rgb} label="Avg" hexRight />
            <span className="text-xs text-gray-500">{avgName}</span>
          </div>
          <div className="flex items-center gap-2">
            <ColorSwatch rgb={compRgb} label="Possible Complementary color" hexRight />
            <span className="text-xs text-gray-500">{compName}</span>
          </div>
        </li>
    );
  };

  const renderBouquetColorRow = (rgb: number[]) => {
    const avgHex = rgbToHex(rgb);
    const compHex = complementaryColorHex(avgHex);
    const compRgb = hexToRgb(compHex);
    return (
        <div className="flex items-center gap-6">
          <ColorSwatch rgb={rgb} label="Bouquet Color" hexRight />
          <ColorSwatch rgb={compRgb} label="Possible Complementary color" hexRight />
        </div>
    );
  };

  return (
      <div className="flex min-h-screen flex-col font-jost">
        <Header />
        <main>
          <Hero />
          <div className="bg-white py-10">
            <div className="container mx-auto px-4">
              <div className="flex gap-4 mb-6 justify-center">
                <label className="flex items-center gap-2">
                  <input
                      type="radio"
                      value="detect"
                      checked={mode === 'detect'}
                      onChange={() => setMode('detect')}
                  />
                  Direct Classification
                </label>
                <label className="flex items-center gap-2">
                  <input
                      type="radio"
                      value="segment-then-detect"
                      checked={mode === 'segment-then-detect'}
                      onChange={() => setMode('segment-then-detect')}
                  />
                  Local Segmentation → Then Classify
                </label>
              </div>

              <div className="flex gap-6 my-4 flex-wrap items-center justify-center">
                <div>
                  <label className="block text-sm font-medium">
                    Confidence: {Math.round(confidence * 100)}%
                  </label>
                  <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={confidence}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Overlap (IoU): {Math.round(overlap * 100)}%
                  </label>
                  <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={overlap}
                      onChange={(e) => setOverlap(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={fillMissing}
                        onChange={(e) => setFillMissing(e.target.checked)}
                    />
                    Smart identification using my algorithm (Beta)
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={applyPrefilter}
                        onChange={(e) => setApplyPrefilter(e.target.checked)}
                    />
                    Apply image prefilter (CLAHE + gamma)
                  </label>
                </div>
              </div>

              <ImageUploader onImageSelect={handleImageSelect} />

              {selectedImage && (
                  <ResultDisplay
                      image={selectedImage}
                      predictions={predictions}
                      isLoading={isAnalyzing}
                      error={error || undefined}
                  />
              )}

              {bouquetColor && (
                  <div className="mt-4">
                    {renderBouquetColorRow(bouquetColor)}
                  </div>
              )}

              {Object.keys(avgColors).length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Average Flower Colors & Complementaries</h4>
                    <ul className="divide-y divide-gray-100">
                      {Object.entries(avgColors).map(([name, color]) => renderAvgAndComplementary(name, color))}
                    </ul>
                  </div>
              )}

              {predictions.length > 0 && (
                  <div className="mt-6 p-4 rounded bg-green-50">
                    <h3 className="text-xl font-semibold text-green-600">
                      🌸 {bouquetText.name}
                    </h3>
                    <p className="mt-2 text-gray-700">{bouquetText.description}</p>
                  </div>
              )}
            </div>
          </div>
          <UseCases />
        </main>
      </div>
  );
};

export default App;
