// import { Server as NetServer } from "http";
// import { Socket, Server as SocketIO} from "socket.io";
// import { NextApiRequest } from "next";

// import { NextApiResponseServerIo } from "./../../../lib/type";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
//     if (!res.socket.server.io) {
//         const path = '/api/socket/io';
//         const httpServer: NetServer = res.socket.server as any;
//         const io = new SocketIO(httpServer, { 
//             path: path,
//             addTrailingSlash: false 
//         });
//         io.on('connection', (socket: Socket) => {
//             console.log('connected');
//         });
//         res.socket.server.io = io;
//     }
//     else {
//     console.log("♻️ Socket.IO server already running");
//   }
//     res.end();
// };

// export default ioHandler;


import type { NextApiRequest,NextApiResponse } from "next";
import type { Server as NetServer } from "http";
import type { Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

// ✅ Extend Next.js response to include `io`
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    // console.log("🔌 Initializing new Socket.IO server...");

    // Attach Socket.IO to the existing Next.js HTTP server
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // ✅ Connection handler
    // io.on("connection", (socket) => {
    //   console.log("✅ A client connected:", socket.id);

    //   socket.on("disconnect", () => {
    //     console.log("❌ A client disconnected:", socket.id);
    //   });
    // });

    res.socket.server.io = io; // Save to server instance
  } else {
    console.log("♻️ Socket.IO server already running");
  }

  res.end(); // end the API response
};

export default ioHandler;
