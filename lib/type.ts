
// import { Server as NetServer, Socket } from "net";
// import { Server as SocketIOServer } from "socket.io";
// import { NextApiRequest } from "next";
import {Server, Profile, Member} from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members : (Member & {profile : Profile})[];
};

// export type NextApiResponseServerIo = NextApiRequest & {
//     socket: Socket & {
//         server: NetServer & {
//             io?: SocketIOServer;
//         };
//     };
// };