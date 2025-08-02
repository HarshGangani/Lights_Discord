"use client";
import { X } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from "@/lib/uploadthings";
import "@uploadthing/react/styles.css";
import "@uploadthing/react" 

interface FileUploadprops{
    onChange : (url ?: string) => void;
    value : string;
    endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({
    endpoint,
    value,
    onChange
    }: FileUploadprops) =>{

    const filetype = value?.split(".").pop();

    if(value && filetype !== "pdf"){
        return(
            <div className="relative h-20 w-20">
                <Image 
                    fill
                    src={value}
                    alt="Upload"
                    className='rounded-full'
                />
                <button
                onClick={() => onChange("")}
                className=' bg-rose-500 text-white  p-1 rounded-full 
                absolute top-0 right-0 shadow-sm'>
                    <X className=" h-4 w-4 " type='button'/>
                </button>
            </div>
        )
    }


    return(
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
            console.log("Upload complete!", res); 
            onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
            console.log("Upload failed:", error);
            }}
        />
    )
}