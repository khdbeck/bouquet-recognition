import axios from "axios";

export async function callRoboflowSeg(base64: string) {
    const endpoint =
        "https://outline.roboflow.com/diyorbek-kholmirzaev-seg-p6gti/2?api_key=l7jn93Rl3UuRCxPgWPMQ";


    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

    const response = await axios.post(endpoint, cleanBase64, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
}
