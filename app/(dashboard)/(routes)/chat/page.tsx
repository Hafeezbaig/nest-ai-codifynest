/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const userMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      // Call the backend API
      const response = await axios.post("/api/chat", { messages: newMessages });

      // Update messages with the response data
      setMessages((current) => [...current, userMessage, { role: "system", content: response.data.content }]);
      form.reset();
    } catch (error: any) {
      console.error("Error during chat generation:", error.response?.data || error.message || error);
      alert("An error occurred while generating the response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessage(text);
      setTimeout(() => {
        setCopiedMessage(null);
      }, 2000); // Reset the copied state after 2 seconds
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div>
      <Heading
        title="Nest Chat"
        description="Connect and converse effortlessly with Nest AI."
        icon={MessageSquare}
        iconColor="text-indigo-500"
        bgColor="bg-indigo-500/10"
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
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Type your prompt here..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 border border-white/10 hover:shadow-[0_2px_2px_rgba(255,255,255,0.3)] w-full"
                disabled={isLoading}
                type="submit"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No Conversation Started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-7 w-full flex items-start gap-x-8 rounded-lg relative",
                  message.role === "user" ? "bg-black text-white border border-white/10" : "bg-black text-white border border-white/10"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <div className="flex-grow overflow-hidden">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-semibold my-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-semibold my-2" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                      li: ({ node, ...props }) => <li className="my-1" {...props} />,
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-white/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => <code className="bg-white/20 rounded-lg p-1" {...props} />,
                      p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.content || ""}
                  </ReactMarkdown>
                </div>
                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                >
                  {copiedMessage === message.content ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;