import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params : {
        invitecode : string;
    }
}

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();
    
    if(!profile) {
        return redirect("/sign-in");
    }

    if(!params.invitecode) {
        return redirect("/");
    }

    const existingServer = await db.server.findFirst({
        where :{
            invitecode : params.invitecode,
            members :{
                some :{
                    profileId : profile.id
                }
            }
        }
    });

    if(existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where :{
            invitecode : params.invitecode,
        },
        data :{
            members :{
                create :[
                    {
                        profileId : profile.id
                    }
                ]
            }
        }
    });

    if(server) {
        return redirect(`/servers/${server.id}`);
    }
    
    return null;
}

export default InviteCodePage;