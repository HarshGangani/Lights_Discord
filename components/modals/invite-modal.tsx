"use client";
import React, { use } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link, RefreshCw, Users } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import axios from "axios";
import { useRouter } from "next/navigation";


export const InviteModal = () => {

  const {onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const router = useRouter();

  const isModalOpen = isOpen && type === "invite";
  const { server } = data;

  const [copied, setcopied] = React.useState(false);
  const [isLoading, setisLoading] = React.useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setcopied(true);
    setTimeout(() => {
      setcopied(false);
    }, 1000);
  };

  const inviteUrl = `${origin}/invite/${server?.invitecode}`;

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      document.body.focus();
    }, 100);
  };

  const onNew = async () =>{
    try{
      setisLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      router.refresh();

      onOpen("invite", {server : response.data});
    }catch(error){
      console.log(error);
    }
    finally{
      setisLoading(false);
    }
  }

      return (
    <Dialog open={isModalOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="z-50 bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden pointer-events-auto border-0 shadow-xl">
        <DialogHeader className="pt-8 px-6 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-6 w-6 text-indigo-500" />
            <DialogTitle className="text-2xl font-bold text-center">
              Invite Friends
            </DialogTitle>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Invite friends to join <span className="font-semibold text-indigo-500">{server?.name}</span>
          </p>
        </DialogHeader>
        
        <div className="p-6 space-y-6"> 
          <div className="space-y-3">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Link className="h-4 w-4" />
              Server invite link
            </label>
            
            <div className="flex items-center gap-2">
              <Input
                disabled={isLoading}
                className="bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 
                focus-visible:ring-0 text-black dark:text-white 
                focus-visible:ring-offset-0 font-mono text-sm"
                value={inviteUrl}
                readOnly
              />
              <Button 
                disabled={isLoading}
                onClick={onCopy}
                size="icon"
                className="bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {copied && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <Check className="h-3 w-3" />
                Link copied to clipboard!
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={onNew}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Generate a new link
              {isLoading ? (
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
              This invite link will expire in 7 days. Only people with the link can join.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}