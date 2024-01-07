import { ID, storage } from "@/appwrite";

export default async function uploadImage(file: File) {
  if (!file) {
    return;
  }

  const fileUploaded = await storage.createFile(
    process.env.APPWRITE_TRELLO_BUCKET_ID!,
    ID.unique(),
    file
  );

  return fileUploaded;
}
