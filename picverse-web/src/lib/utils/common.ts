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


export const chunk = <T>(array: T[], size: number = 2): T[][] => {
  if (!Array.isArray(array) || !array.length) return [];
  const result = [];
  let index = 0;

  while (index < array.length) {
    result.push(array.slice(index, (index += size)));
  }

  return result;
};