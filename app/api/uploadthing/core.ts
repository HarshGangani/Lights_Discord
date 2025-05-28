import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();         
  if (!userId) throw new UploadThingError("Unauthorized"); 
  return { userId };       
};

// Define your UploadThing routes
export const ourFileRouter = {
  serverImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(handleAuth)            
    .onUploadComplete(async ({ metadata, file }) => {
      // runs after the upload finishes
      console.log("Done for", metadata.userId, "→", file.url);
    }),

  messageFile: f(["image", "pdf"])
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
       console.log("Uploaded", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
