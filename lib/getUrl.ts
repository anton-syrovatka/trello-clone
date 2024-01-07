import { storage } from "@/appwrite";
import { TaskImage } from "@/typings";

export default async function getUrl(image: TaskImage) {
  const url = storage.getFilePreview(image.bucketId, image.fileId);

  return url;
}
