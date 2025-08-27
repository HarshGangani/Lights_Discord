import { redirect } from "next/navigation";
import { NavigationItem } from "./navigation-item";
// import { useRouter } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { ScrollArea } from "../ui/scroll-area";
import { ModeToggle } from "../modal-toggle";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

import NavigationAction from "./navigation-action";
import { SignOutButton, UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {

    const profile = await currentProfile();

    if(!profile)
    {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where :{
            members :{
                some :{
                    profileId : profile.id
                }
            }
        }
    });


    return(
        <div className="space-y-4 flex flex-col items-center h-full text-primary
            w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationAction/>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700" />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name}/>
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <SignOutButton redirectUrl="/sign-in" >
                <UserButton
                    appearance={{
                    elements: {
                        avatarBox: "h-[48px] w-[48px]",
                    },
                    }}
                />
                </SignOutButton>
            </div>
        </div>
    )
}

export default NavigationSidebar;