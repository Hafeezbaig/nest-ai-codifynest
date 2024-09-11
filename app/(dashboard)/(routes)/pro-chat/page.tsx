"use client";

import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquareCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const ConversationPage = () => {
    const form = useForm<z.infer<typeof  formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    return (
        <div>
            <Heading 
            title="Nest Pro Chat"
            description="Utilizing cutting-edge AI for professional-level interactions."
            icon={MessageSquareCode}
            iconColor="text-blue-500"
            bgColor="bg-blue-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="
                        rounded-lg
                        border
                        border-white/10
                        w-full
                        p-4
                        px-3
                        md:px-6
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-2
                        "
                        >
                            <FormField
                               name="prompt"
                               render={({ field }) => (
                                  <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input 
                                        className="border-0 outline-none 
                                        focus-visible:ring-0 
                                        focus-visible:ring-transparent"
                                        disabled={isLoading}
                                        placeholder="Can you help me draft a professional email?"
                                        {...field}
                                        />
                                        
                                    </FormControl>
                                  </FormItem>
                                )}
                            />
                            <Button className="col-span-12 
                            lg:col-span-2 
                            border 
                            border-white/10
                            hover:shadow-[0_2px_2px_rgba(255,255,255,0.3)] 
                            w-full
                            " disabled={isLoading}>
                                Generate
                            </Button>

                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    Messages Content
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;