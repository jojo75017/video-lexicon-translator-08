type ImagePayload = {
  type?: string;
  b64_json?: string;
  error?: { message?: string };
  data?: Array<{ b64_json?: string }>;
};

export interface AplusImageRequest {
  bookTitle: string;
  moduleTitle: string;
  moduleText: string;
  visualSuggestion: string;
  width: number;
  height: number;
}

function dataUrlFromPayload(payload: ImagePayload): string | null {
  const b64 = payload.b64_json ?? payload.data?.[0]?.b64_json;
  return b64 ? `data:image/png;base64,${b64}` : null;
}

async function readError(response: Response): Promise<string> {
  const raw = await response.text().catch(() => "");
  try {
    const body = JSON.parse(raw) as { error?: string | { message?: string }; message?: string };
    if (typeof body.error === "string") return body.error;
    return body.error?.message ?? body.message ?? `Erreur ${response.status}`;
  } catch {
    return raw || `Erreur ${response.status}`;
  }
}

export async function generateAplusImage(
  request: AplusImageRequest,
  accessToken: string,
  onFrame: (dataUrl: string, final: boolean) => void,
): Promise<void> {
  const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kdp-aplus-image`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  };
  const send = (stream: boolean) => fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...request, stream }),
  });

  const response = await send(true);
  if (!response.ok || !response.body) throw new Error(await readError(response));

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let sawEvent = false;
  let completed = false;
  let streamError = "";
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buffer += chunk.value.replace(/\r\n/g, "\n");
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const event of events) {
      const eventName = event.split("\n").find((line) => line.startsWith("event:"))?.slice(6).trim();
      const data = event.split("\n").filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
      if (!data || data === "[DONE]") continue;
      let payload: ImagePayload;
      try { payload = JSON.parse(data) as ImagePayload; } catch { continue; }
      sawEvent = true;
      if (eventName === "error" || payload.type === "error") {
        streamError = payload.error?.message ?? "La création de l’image a été refusée.";
        continue;
      }
      const type = eventName || payload.type;
      if (type !== "image_generation.partial_image" && type !== "image_generation.completed") continue;
      const image = dataUrlFromPayload(payload);
      if (!image) continue;
      const final = type === "image_generation.completed";
      onFrame(image, final);
      if (final) completed = true;
    }
  }
  if (streamError) throw new Error(streamError);
  if (completed) return;
  if (sawEvent) throw new Error("La création s’est arrêtée avant l’image finale.");

  const replay = await send(false);
  if (!replay.ok) throw new Error(await readError(replay));
  const payload = await replay.json() as ImagePayload;
  const image = dataUrlFromPayload(payload);
  if (!image) throw new Error(payload.error?.message ?? "Aucune image n’a été reçue.");
  onFrame(image, true);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("L’image générée ne peut pas être préparée."));
    image.src = src;
  });
}

export async function downloadAplusImage(src: string, width: number, height: number, filename: string) {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Téléchargement indisponible dans ce navigateur.");

  const sourceRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (sourceRatio > targetRatio) {
    sw = image.naturalHeight * targetRatio;
    sx = (image.naturalWidth - sw) / 2;
  } else {
    sh = image.naturalWidth / targetRatio;
    sy = (image.naturalHeight - sh) / 2;
  }
  context.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
  if (!blob) throw new Error("Le fichier JPG n’a pas pu être créé.");
  if (blob.size > 2 * 1024 * 1024) throw new Error("L’image dépasse 2 Mo. Essayez une nouvelle génération.");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}