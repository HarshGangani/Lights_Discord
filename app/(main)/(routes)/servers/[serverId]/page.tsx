import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdPageprops {
    params: {serverId: string}
}

const ServerIdPage = async (
    {
        params
}: ServerIdPageprops)  => {

    const profile = await currentProfile();

    if(!profile) {
        return redirect("/sign-in");
    }

    const server = await db.server.findUnique({
        where :{
            id : params.serverId,
            members:{
                some:{
                    profileId : profile.id
                }
            }
        },
        include :{
            Channels :{
                where :{
                    name : "general"
                },
                orderBy :{
                    createdAt : "asc"
                }
            }
        }
    });

    const intialChannel = server?.Channels[0];

    if(intialChannel?.name !== "general"){
        return null;
    }


    return redirect (`/servers/${params.serverId}/channels/${intialChannel?.id}`); 
} 
export default ServerIdPage;