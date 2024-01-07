import { storage } from "@/appwrite";
import { Image } from "@/typings";

export default async function getUrl(image: Image) {
  const url = storage.getFilePreview(image.bucketId, image.fileId);

  return url;
}
