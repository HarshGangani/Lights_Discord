import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";

import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Video, Mic, ShieldCheck, ShieldAlert } from "lucide-react";

interface ServerSidebarProps{
    serverId : string
}

const iconMap = {
    [ChannelType.TEXT] : <Hash className="mr-2 h-4 w-4 "/>  ,
    [ChannelType.AUDIO] : <Mic className="mr-2 h-4 w-4 "/>  ,
    [ChannelType.VIDEO] : <Video className="mr-2 h-4 w-4 "/>,
}

const roleIconMap = {
    [MemberRole.GUEST] : null,
    [MemberRole.MODERATOR] : <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500"/>,
    [MemberRole.ADMIN] :<ShieldAlert className="h-4 w-4 mr-2 text-indigo-500"/>
}

export const ServerSidebar = async ({
    serverId
}:ServerSidebarProps) => {

    const profile = await currentProfile();

    if(!profile) {
        return redirect("/sign-in");
    }

    const server =await db.server.findUnique({
        where :{
            id : serverId,
        },
        include:{
            Channels :{
                orderBy :{
                    createdAt : "asc"
                },
                where :{
                    type : "TEXT",
                },
            },

            members:{
                include :{
                    profile : true,
                },
                orderBy :{
                    role : "asc",
                }
            },
        }
    });
    

    const textChannels = server?.Channels.filter((channel) => channel.type === ChannelType.TEXT); 
    const audioChannels = server?.Channels.filter((channel) => channel.type === ChannelType.AUDIO); 
    const videoChannels = server?.Channels.filter((channel) => channel.type === ChannelType.VIDEO); 
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if(!server){
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return(
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#1E1F22] bg-[#F2F3F5]">
                <ServerHeader server={server} role={role}/>
            

            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch 
                        data={
                            [
                                {
                                    label : "Text Channels",
                                    type : "Channel",
                                    data : textChannels?.map((channel) => ({
                                        id : channel.id,
                                        name : channel.name,
                                        icon : iconMap[channel.type],
                                    })),
                                },
                                {
                                    label : "Voice Channels",
                                    type : "Channel",
                                    data : audioChannels?.map((channel) => ({
                                        id : channel.id,
                                        name : channel.name,
                                        icon : iconMap[channel.type],
                                    })),
                                },
                                {
                                    label : "Video Channels",
                                    type : "Channel",
                                    data : videoChannels?.map((channel) => ({
                                        id : channel.id,
                                        name : channel.name,
                                        icon : iconMap[channel.type],
                                    })),
                                },
                                {
                                    label : "Members",
                                    type : "member",
                                    data : members?.map((member) => ({
                                        id : member.id,
                                        name : member.profile.name,
                                        icon : roleIconMap[member.role],
                                    })),
                                },
                        ]}
                        />
                </div>
            </ScrollArea>
        </div>
    )
}
