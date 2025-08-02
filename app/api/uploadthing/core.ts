import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();         
  if (!userId) throw new UploadThingError("Unauthorized"); 
  return { userId: userId };       
};

// Define your UploadThing routes
export const ourFileRouter = {
  serverImage: f({
  image: { maxFileSize: "4MB", maxFileCount: 1 },
})
  .middleware(() => handleAuth())
  .onUploadComplete(async ({ metadata, file }) => {
    try {
       console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };

    } catch (err) {
      console.error("UploadThing callback error:", err);
      throw new Error("Failed inside onUploadComplete");
    }
  }),


  messageFile: f(["image", "pdf"])
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
       console.log("Uploaded", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
