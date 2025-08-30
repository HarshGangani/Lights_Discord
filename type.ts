
import {Server, Profile, Member} from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
    members : (Member & {profile : Profile})[];
};

import type { NextApiResponse } from "next";
import type { Server as HttpServer } from "http";
import type { Socket } from "net";
import type { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: HttpServer & {
      io?: SocketIOServer;
    };
  };
};
