"use client";

import { useMutation } from "@tanstack/react-query";

import { MutationKeys, CLOUDINARY_API_BASE_URL, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET } from "../constants";
import { generateCloudinarySignature } from "../utils";
import { timeStamp } from "console";

export const useUploadCloudinaryImage = () => {
  return useMutation<CloudinaryImage, Error, File>({
    mutationKey: [MutationKeys.UPLOAD_CLD_IMAGE],
    mutationFn: (file: File) => {
      return new Promise(async (resolve, reject) => {
        const data: FormData = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        data.append("api_key", CLOUDINARY_API_KEY);
        data.append("source", "uw");

        const response = await fetch(`${CLOUDINARY_API_BASE_URL}/${CLOUDINARY_UPLOAD_PRESET}/upload`, {
          method: "POST",
          body: data,
        });

        if (response.ok) {
          const cldMedia: CloudinaryImage = await response.json();

          resolve(cldMedia);
        } else {
          reject("Failed to upload");
        }
      });
    },
  });
};

export const useDeleteCloudinaryImage = () => {
  return useMutation<string, Error, string>({
    mutationKey: [MutationKeys.DELETE_CLD_IMAGE],
    mutationFn: (id: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const params = { timestamp: Math.floor(Date.now() / 1000), public_id: id };

          const data: FormData = new FormData();
          data.append("api_key", CLOUDINARY_API_KEY);
          data.append("timestamp", String(params.timestamp));
          data.append("public_id", id);
          data.append("signature", String(generateCloudinarySignature(params)));

          const response = await fetch(`${CLOUDINARY_API_BASE_URL}/dzkrqcjd9/image/destroy`, {
            method: "POST",
            body: data,
          });

          if (response.ok) {
            resolve("Media deleted successfully");
          } else {
            reject("Failed to delete media");
          }
        } catch (error) {
          console.log(error);

          reject("Error deleting media:" + error);
        }
      });
    },
  });
};
