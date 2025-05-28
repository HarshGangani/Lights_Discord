// import { createRouteHandler } from "uploadthing/next";

// import { ourFileRouter } from "./core";

// // Export routes for Next App Router
// export const { GET, POST } = createRouteHandler({
//   router: ourFileRouter,

//   // Apply an (optional) custom config:
//   // config: { ... },
// });


// app/api/uploadthing/route.ts

import { createUploadthing, type FileRouter } from "uploadthing/server";
import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core"; 

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
