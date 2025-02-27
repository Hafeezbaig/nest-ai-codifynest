"use client";

import Image from "next/image";

import Link from "next/link";

import { Montserrat } from "next/font/google";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { CircleHelp, 
    // CodeIcon, 
    HomeIcon,
    //  ImageIcon,
    // LayoutDashboard,
    MessageSquare, 
    // MessageSquareCode, 
    // MusicIcon, 
    Settings2Icon, 
    // VideoIcon
} from "lucide-react";



const montserrat = Montserrat ({
    weight: "600",
    subsets: ["latin"]
});

const routes = [
    {
        label: "Dashboard",
        // icon: LayoutDashboard,
        icon: HomeIcon,
        href: "/dashboard",
        color: "text-sky-500"
    },
    {
        label: "Nest Chat",
        icon: MessageSquare,
        href: "/chat",
        color: "text-indigo-500"
    },
    // {
    //     label: "Nest Pro Chat",
    //     icon: MessageSquareCode,
    //     href: "/pro-chat",
    //     color: "text-blue-500"
    // },
    // {
    //     label: "Image Studio",
    //     icon: ImageIcon,
    //     href: "/image-studio",
    //     color: "text-purple-500"
    // },
    // {
    //     label: "Video Studio",
    //     icon: VideoIcon,
    //     href: "/video-studio",
    //     color: "text-orange-500"
    // },
    // {
    //     label: "Sound Studio",
    //     icon: MusicIcon,
    //     href: "/sound-studio",
    //     color: "text-cyan-500"
    // },
    // {
    //     label: "Code Builder",
    //     icon: CodeIcon,
    //     href: "/code",
    //     color: "text-emerald-500"
    // },
    {
        label: "What's New?",
        icon: CircleHelp,
        href: "/updates",
        color: "text-blue-500"
    },
    {
        label: "Settings",
        icon: Settings2Icon,
        href: "/settings",
        color: "text-white-500"
    }
]

const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                <div className="relative w-8 h-8 mr-4">
                    <Image 
                    fill
                    alt="Logo"
                    src="/logo.png"
                    />
                </div>
                <h1 className={cn ("text-2xl font-bold",
                    montserrat.className)}>
                    Nest AI
                </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                        href={route.href}
                        key={route.href}
                        className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                            pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                        )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>

                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;