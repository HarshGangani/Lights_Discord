"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";


export const LeaveServerModal = () => {

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";
  const { server } = data;

  const [isLoading, setisLoading] = React.useState(false);

  const onLeave = async () => {
    try {
      setisLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
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
      <DialogContent className="z-50 bg-white dark:bg-[#313338] text-black dark:text-white p-0 overflow-hidden pointer-events-auto border-0 shadow-xl">
        <DialogHeader className="pt-8 px-6 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DialogTitle className="text-2xl font-bold text-center">
              Leave Server
            </DialogTitle>

            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to leave <span 
              className="font-semibold text-indigo-500">{server?.name}</span>?
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4 dark:bg-zinc-800" >
          <div className="flex items-center justify-between w-full">
              <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost">
                Cancel
              </Button>

              <Button 
              disabled={isLoading}
              onClick={onLeave}
              variant="primary">
                Confirm
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}