"use client";
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
    return(
    <div className="rounded-xl border border-dashed p-4 text-center">
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
    </div>
    )
}