import Image from "next/image";

export const Loader = () => {
    return (
        <div className="h-full flex flex-col gap-y-4 items-center justif-center">

            {/* <div className="w-60 h-60 relative">  */}
            <div className="w-10 h-10 relative animate-spin">
                <Image 
                alt="logo"
                fill
                src="/loader.png"
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Nest AI is Thinking...
            </p>            
        </div>
    )
};