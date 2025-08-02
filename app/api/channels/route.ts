import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: {memberId: string }}
){
    try{
        const profile = await currentProfile();
        const {name, type} = await req.json();
        const { searchParams } = new URL(req.url);

        const serverId  = searchParams.get("serverId");

         if(!profile)
        {
            return new NextResponse("Unauathorized", {status : 401});
        }
        
        if(!serverId){
            return new NextResponse("Server Id missing", {status : 400});
        }

        if(name === "general"){
            return new NextResponse("Name can not be 'general'", {status : 400});
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                members:{
                    some:{
                        profileId: profile.id,
                        role:{
                            in:[MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                Channels:{
                      create:{
                        profileId: profile.id,
                        name,
                        type,
                    }                 
                }
            },
        })

        return NextResponse.json(server);
        
    } catch(error){
        console.log("[MEMBRES_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status : 500});        
    }
}