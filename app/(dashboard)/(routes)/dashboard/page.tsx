"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, ImageIcon, MessageSquare, MessageSquareCode, VideoIcon, MusicIcon, CodeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [

{
    label: "Nest Chat",
    icon: MessageSquare,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    href: "/chat"
},   
{
    label: "Nest Pro Chat",
    icon: MessageSquareCode,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/pro-chat"
},
{
    label: "Image Studio",
    icon: ImageIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/image-studio"
},
{
    label: "Video Studio",
    icon: VideoIcon,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    href: "/video-studio"
},
{
    label: "Sound Studio",
    icon: MusicIcon,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    href: "/sound-studio"
},
{
    label: "Code Builder",
    icon: CodeIcon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/code"
}
]

const DashboardPage = () => {
    const router = useRouter();
    return (

        <div>
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:text-4xl font-bold text-center">
                    Explore the power of AI
                </h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
                Chat with the smartest AI - Explore the power of AI
                </p>                      
            </div>
            <div className="px-4 md:px-20 lg:px-32 space-y-4">
                {tools.map((tool) => (
                    <Card 
                    onClick={() => router.push(tool.href)}
                    key={tool.href}
                    // the bg-black you can add /5 or /10 to change colour, it is the box colour i have added - hafeez 
                    className="p-4 bg-black/5 border-white/10 flex items-center justify-between hover:shadow-[0_2px_1px_rgba(255,255,255,0.5)] transition cursor-pointer"
                    >
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                <tool.icon className={cn("w-8 h-8", tool.color)} />

                            </div>
                            <div className="font-semibold text-white">
                                {tool.label}
                            </div>

                        </div>
                        <ArrowRight className="w-5 h-5 text-white" />

                    </Card>
                ))}            
            </div>      
        </div>
       
    )
}

export default DashboardPage;