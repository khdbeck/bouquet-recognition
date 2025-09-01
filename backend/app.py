from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Header, Query
from fastapi.middleware.cors import CORSMiddleware
import torch
from ultralytics import YOLO
from PIL import Image
import io
import cv2
import numpy as np
from scipy.spatial import ConvexHull
from matplotlib.path import Path

app = FastAPI(title="YOLOv12 Bouquet Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "myresearchapikey"
MODEL = "YOLOv12l.pt"
SEG_MODEL = "segment.pt"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

detection_model = YOLO(MODEL).to(device)
segmentation_model = YOLO(SEG_MODEL).to(device)


def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API")
    return x_api_key


def prefiltering(img: np.ndarray, gamma_val: float = 1.4) -> np.ndarray:
    try:
        lab_img = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab_img)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l_eq = clahe.apply(l)
        merged = cv2.merge((l_eq, a, b))
        enhanced = cv2.cvtColor(merged, cv2.COLOR_LAB2RGB)
        gamma_corrected = np.power(enhanced / 255.0, 1.0 / gamma_val)
        return np.clip(gamma_corrected * 255, 0, 255).astype("uint8")
    except Exception:
        return img


def dominant_color(img_np: np.ndarray) -> tuple:
    flattened = img_np.reshape(-1, 3)
    black_filtered = flattened[np.any(flattened != [0, 0, 0], axis=1)]
    if black_filtered.size == 0:
        return (0, 0, 0)
    return tuple(map(int, np.mean(black_filtered, axis=0)))


def average_color(images: list) -> tuple:
    try:
        pixels = np.concatenate(
            [
                img.reshape(-1, 3)
                for img in images
                if isinstance(img, np.ndarray) and img.size > 0
            ]
        )
        return tuple(map(int, np.mean(pixels, axis=0))) if pixels.size else (0, 0, 0)
    except Exception:
        return (0, 0, 0)


def complementary_color(rgb: tuple) -> tuple:
    r, g, b = rgb
    return (255 - r, 255 - g, 255 - b)


def extract_combined_box_color(img_np: np.ndarray, box_list: list) -> tuple:
    mask = np.zeros(img_np.shape[:2], dtype=np.uint8)
    for x1, y1, x2, y2 in box_list:
        x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
        mask[y1:y2, x1:x2] = 255
    return dominant_color(cv2.bitwise_and(img_np, img_np, mask=mask))


@app.post("/predict/")
async def detect_flowers(
    file: UploadFile = File(...),
    confidence: float = Query(0.5, ge=0, le=1),
    overlap: float = Query(0.45, ge=0, le=1),
    fill_missing: bool = Query(False),
    prefilter: bool = Query(False),
):
    try:
        img_bytes = await file.read()
        pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        img_np = np.array(pil_img)
        if prefilter:
            img_np = prefiltering(img_np)
            model_input = Image.fromarray(img_np)
        else:
            model_input = pil_img

        detection_result = detection_model(model_input, conf=confidence, iou=overlap)[0]

        boxes = (
            detection_result.boxes.xyxy.tolist()
            if detection_result.boxes is not None
            else []
        )
        scores = (
            detection_result.boxes.conf.tolist()
            if detection_result.boxes is not None
            else []
        )
        class_ids = (
            detection_result.boxes.cls.tolist()
            if detection_result.boxes is not None
            else []
        )
        labels = [detection_model.names[int(i)] for i in class_ids]

        detections = []
        color_buckets = {}
        flower_centers = []
        flower_areas = []

        for label, conf, box in zip(labels, scores, boxes):
            x1, y1, x2, y2 = map(int, box)
            crop = img_np[y1:y2, x1:x2]
            dom_color = dominant_color(crop)
            comp_color = complementary_color(dom_color)
            cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
            bbox_area = (x2 - x1) * (y2 - y1)

            flower_centers.append((cx, cy))
            flower_areas.append(bbox_area)

            detections.append(
                {
                    "name": label,
                    "confidence": round(float(conf), 4),
                    "bbox": [x1, y1, x2, y2],
                    "dominant_color": list(dom_color),
                    "complementary_color": list(comp_color),
                    "center": [cx, cy],
                    "area": bbox_area,
                }
            )

            color_buckets.setdefault(label, []).append(crop)

        median_area = np.median(flower_areas) if flower_areas else 0
        width = img_np.shape[1]

        def close_neighbor_check(center, all_centers, threshold=0.35 * width):
            for other in all_centers:
                if (
                    other != center
                    and np.linalg.norm(np.array(center) - np.array(other)) < threshold
                ):
                    return True
            return False

        low_conf = None
        if fill_missing:
            try:
                if len(flower_centers) >= 3:
                    hull = ConvexHull(np.array(flower_centers))
                    hull_path = Path(np.array(flower_centers)[hull.vertices])
                    hull_pts = np.array(flower_centers)[hull.vertices]

                    min_x, min_y = np.min(hull_pts, axis=0).astype(int)
                    max_x, max_y = np.max(hull_pts, axis=0).astype(int)

                    spacing = int(np.sqrt(median_area)) or 30
                    step = spacing * 2

                    potential_pts = [
                        (x, y)
                        for x in range(min_x, max_x, step)
                        for y in range(min_y, max_y, step)
                    ]

                    missing_spots = []
                    for pt in potential_pts:
                        if hull_path.contains_point(pt):
                            if not any(
                                np.linalg.norm(np.array(pt) - np.array(c)) <= spacing
                                for c in flower_centers
                            ):
                                missing_spots.append(pt)
                else:
                    hull_path = None
                    missing_spots = []

                low_conf = max(0.03, min(0.30, float(confidence) * 0.5))
                det_low = detection_model(model_input, conf=low_conf, iou=overlap)[0]
                boxes_low = (
                    det_low.boxes.xyxy.tolist() if det_low.boxes is not None else []
                )
                scores_low = (
                    det_low.boxes.conf.tolist() if det_low.boxes is not None else []
                )
                class_ids_low = (
                    det_low.boxes.cls.tolist() if det_low.boxes is not None else []
                )

                extra_predictions = []
                for i in range(len(class_ids_low)):
                    cls_id_l = class_ids_low[i]
                    conf_l = float(scores_low[i])
                    box_l = boxes_low[i]

                    if conf_l >= confidence:
                        continue

                    x1, y1, x2, y2 = map(int, box_l)
                    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
                    bbox_area = (x2 - x1) * (y2 - y1)

                    if median_area and bbox_area >= 2 * median_area:
                        continue
                    if hull_path is not None and not hull_path.contains_point((cx, cy)):
                        continue

                    crop = img_np[y1:y2, x1:x2]
                    dom_color = dominant_color(crop)
                    comp_color = complementary_color(dom_color)

                    extra_predictions.append(
                        {
                            "name": detection_model.names[int(cls_id_l)],
                            "confidence": round(conf_l, 4),
                            "bbox": [x1, y1, x2, y2],
                            "dominant_color": list(dom_color),
                            "complementary_color": list(comp_color),
                            "center": [cx, cy],
                            "area": bbox_area,
                            "inferred": True,
                        }
                    )

                used_indices = set()
                if missing_spots:
                    for pt in missing_spots:
                        for i, pred in enumerate(extra_predictions):
                            if i in used_indices:
                                continue
                            if (
                                np.linalg.norm(np.array(pred["center"]) - np.array(pt))
                                < step
                            ):
                                detections.append(pred)
                                used_indices.add(i)
                                break
                else:
                    detections.extend(extra_predictions)

            except Exception as e:
                print("Couldnt fill the gaps:", e)

        accept_threshold = (
            low_conf if (fill_missing and low_conf is not None) else confidence
        )

        final_results = []
        for det in detections:
            bbox_area = det.get("area", 0)
            conf_det = det.get("confidence", 0.0)
            inferred = det.get("inferred", False)

            if inferred or (
                (not fill_missing and conf_det >= confidence)
                or (fill_missing and conf_det >= accept_threshold)
            ):
                if not fill_missing or (
                    bbox_area < 15 * median_area
                    and close_neighbor_check(det["center"], flower_centers)
                ):
                    det.pop("center", None)
                    det.pop("area", None)
                    final_results.append(det)

        average_colors = {
            label: list(average_color(crops)) for label, crops in color_buckets.items()
        }
        bouquet_color = list(
            extract_combined_box_color(img_np, [d["bbox"] for d in final_results])
        )

        return {
            "detailed": final_results,
            "bounding_box_avcolor": average_colors,
            "bouquet_color": bouquet_color,
        }

    except Exception as e:
        return {"error": f"error: {str(e)}"}


@app.post("/segment/")
async def segment_image_points_only(
    file: UploadFile = File(...),
    x_api_key: str = Depends(verify_api_key),
    conf: float = 0.30,
    iou: float = 0.55,
    imgsz: int = 960,
    prefilter: bool = Query(False),
):
    try:
        img_bytes = await file.read()
        pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        img = np.array(pil)
        if prefilter:
            img = prefiltering(img)
        H, W = img.shape[:2]

        res = segmentation_model.predict(
            img, conf=conf, iou=iou, imgsz=imgsz, verbose=False, retina_masks=True
        )[0]

        if res.masks is None:
            return {
                "width": W,
                "height": H,
                "instances": [],
                "meta": {"format": "normalized", "conf": conf, "iou": iou, "imgsz": imgsz},
            }

        instances = []
        for poly in res.masks.xyn:
            if poly is None or len(poly) < 3:
                continue
            points = [{"x": float(x), "y": float(y)} for x, y in poly]
            instances.append({"points": points})

        return {
            "width": W,
            "height": H,
            "instances": instances,
            "meta": {"format": "normalized", "conf": conf, "iou": iou, "imgsz": imgsz},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Segmentation failed: {e}")

