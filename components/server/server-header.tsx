"use client";

import { ServerWithMembersWithProfiles } from "@/lib/type";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, User, UserPlus, Users } from "lucide-react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
    // type: ChannelType;
}

export const ServerHeader = ({
    server,
    role
} : ServerHeaderProps) =>{

    const {onOpen} = useModal();

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR

    return(
        <DropdownMenu>
            <DropdownMenuTrigger 
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            asChild
            >
                <button
                className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2
                hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>

            {/* <DropdownMenuContent forceMount
            className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"> */}
            <DropdownMenuContent
            className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}>

                {isModerator && (
                    <DropdownMenuItem
                    // onClick={ () => onOpen("invite", {server})}
                    onClick={() => onOpen("invite", {server})}
                    onSelect={(e) => {
                      e.preventDefault();
                      onOpen("invite", {server});
                    }}
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                        Invite people
                        <span className="ml-auto">
                            <UserPlus className="h-4 w-4" />
                        </span>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("editServer", {server})}
                    className=" px-3 py-2 text-sm cursor-pointer">
                        Server settings
                        <span className="ml-auto">
                            <Settings className="h-4 w-4" />
                        </span>
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("members", {server})}
                    className=" px-3 py-2 text-sm cursor-pointer">
                        Manage members
                        <span className="ml-auto">
                            <Users className="h-4 w-4" />
                        </span>
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuItem
                    onClick={() => onOpen("createChannel", {server})}
                    className=" px-3 py-2 text-sm cursor-pointer">
                        Create Channel
                        <span className="ml-auto">
                            <PlusCircle className="h-4 w-4" />
                        </span>
                    </DropdownMenuItem>
                )}

                {isModerator && (
                    <DropdownMenuSeparator/>
                )}

                {isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("deleteServer", {server})}
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

                {!isAdmin && (
                    <DropdownMenuItem
                    onClick={() => onOpen("leaveServer", {server})}
                    className="text-rose-500 px-3 py-2 text-sm cursor-pointer">
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto" />
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}