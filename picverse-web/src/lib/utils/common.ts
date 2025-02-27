import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const deepMergeObjects = (obj1: any, obj2: any) => {
  if (obj2 === null || obj2 === undefined) {
    return obj1;
  }

  const output = { ...obj2 };

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (obj1[key] && typeof obj1[key] === "object" && obj2[key] && typeof obj2[key] === "object") {
        output[key] = deepMergeObjects(obj1[key], obj2[key]);
      } else {
        output[key] = obj1[key];
      }
    }
  }

  return output;
};

export const download = (url: string, filename: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;

      if (filename && filename.length) a.download = `${filename.replace(" ", "_")}.png`;
      document.body.appendChild(a);
      a.click();
    })
    .catch((error) => console.log({ error }));
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#eeeeee" offset="20%" />
      <stop stop-color="#f1f1f1" offset="50%" />
      <stop stop-color="#eeeeee" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#eeeeee" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

export const skeletonPlaceholder = `data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`;

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null;

  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const preventSelectDefault = (event: Event) => {
  event.preventDefault();
};

export const getRandomArrayItem = (array: Array<any>) => {
  const randomObject = array[Math.floor(Math.random() * array.length)];
  return randomObject;
};

export const getAxiosErrorMessage = (error: AxiosError): string => {
  const messages: string | Array<string> = error.response?.data.message || "Unknow error";

  return Array.isArray(messages) ? messages.reduce((prev, message) => `${prev}, \n ${message}`, "") : messages;
};

export const isErrorField = (error: AxiosError, fieldName: string) => {
  const message = getAxiosErrorMessage(error);

  return message.includes(fieldName);
};

export const showAxiosToastError = (error: AxiosError) => {
  toast.error(getAxiosErrorMessage(error));
};

export const showToastError = (error: Error) => {
  toast.error(error.message);
};

export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    try {
      new Notification(title, options);
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export const getResourceUrl = (resourceId: string): string =>
  `${process.env.NEXT_PUBLIC_API_SERVER_ORIGIN}/api/cloud/file/${resourceId}`;

export function formatTimestamp(date?: Date): string {
  if (!date) return "";

  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

export const encrypt = (text: string): string => {
  const iv: Buffer = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    process.env.NEXT_PUBLIC_ENCRYPT_ALGORITHM,
    Buffer.from(process.env.NEXT_PUBLIC_ENCRYPT_SECRET),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (encryptedText: string): string => {
  const [ivHex, encryptedData] = encryptedText.split(":");
  const iv: Buffer = Buffer.from(ivHex, "hex");
  const encryptedBuffer: Buffer = Buffer.from(encryptedData, "hex");
  const decipher = crypto.createDecipheriv(
    process.env.NEXT_PUBLIC_ENCRYPT_ALGORITHM,
    Buffer.from(process.env.NEXT_PUBLIC_ENCRYPT_SECRET),
    iv,
  );
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const objectToFormData = (payload: Object) => {
  const data = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "boolean") {
        data.append(key, value.toString());
      } else if (Array.isArray(value)) {
        value.forEach((tag) => data.append(key, tag));
      } else {
        data.append(key, value);
      }
    }
  });

  return data;
};
