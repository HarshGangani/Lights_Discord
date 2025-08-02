"use client";
import React, { useState } from "react";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";


import { useModal } from "@/hooks/use-modal-store";

import { ServerWithMembersWithProfiles } from "@/lib/type";
import { ScrollArea } from "../ui/scroll-area";
import { UseAvatar } from "@/components/user-avatar";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldCheck, ShieldQuestion } from "lucide-react";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  "GUEST" :null,
  "MODERATOR" : <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
  "ADMIN" :<ShieldCheck className="h-4 w-4 text-rose-500"/>
}



export const MembersModal = () => {

  const Router = useRouter();

  const {onOpen, isOpen, onClose, type, data } = useModal();
  const[loadingId, setloadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as {server : ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) =>{
    try{
      setloadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query:{
          serverId: server?.id,
        }
      })

      const response = await axios.delete(url);

      Router.refresh();
      onOpen("members", {server: response.data});
    }
   catch(error){
    console.log(error);
  }finally{
    setloadingId("")
  }
};

  const onRoleChange = async (memberId: String, role : MemberRole) =>{
    try{
      setloadingId(String(memberId));
      const url = qs.stringifyUrl({
        url: `api/memebers/${String(memberId)}`,
        query:{
          serverId: server?.id
        }
      })

      const response = await axios.patch(url, {role});

      Router.refresh();
      onOpen("members", { server : response.data});
    }catch(error){
      console.log(error);
    }finally{
      setloadingId("");
    }
  };

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      document.body.focus();
    }, 100);
  };


return (
    <Dialog open={isModalOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="z-50 bg-white dark:bg-[#313338] text-black dark:text-white overflow-hidden pointer-events-auto border-0 shadow-xl">
        <DialogHeader className="pt-8 px-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
              Manage Members
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-zinc-500">
          {server?.members?.length} Members
        </DialogDescription>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UseAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">
                  {member.profile.email}
                </p>
              </div>
              {server.profileId !== member.profileId &&
              loadingId !== member.id &&(
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion 
                            className="w-4 h-4 mr-2"/>
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                            onClick={ () =>{ onRoleChange(member.id, "GUEST") } }>
                              <Shield className="h-4 w-4 mr-2"/>
                              Guest
                              {member.role === "GUEST" && (
                                <Check className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                            onClick={ () =>{ onRoleChange(member.id, "MODERATOR") } }>
                              <Shield className="h-4 w-4 mr-2"/>
                              Moderator
                              {member.role === "MODERATOR" && (
                                <Check className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                              <ShieldCheck className="h-4 w-4 mr-2"/>
                              ADMIN
                              {member.role === "ADMIN" && (
                                <Check className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>{onKick(member.id)}}
                      >
                        <Gavel className="h-4 w-4 ml-auto"/>
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {loadingId !== member.id && (
                <Loader2 className="animate-spin text-zinc-500 h-4 w-4 ml-auto"/>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}