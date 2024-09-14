/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { MessageSquare, Copy, Check } from "lucide-react"; // Import the Copy and Check icons
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import Footer from "@/components/footer";

const formatContent = (content: string) => {
    // Refined content formatting for cleaner and slightly spaced output
    const formattedContent = content
      // Convert headers (### and ##) with optional line breaks following them
      .replace(/###\s*(.*?)(?:\n|$)/g, "<h4 style='margin: 0.5em 0;'>$1</h4>") 
      .replace(/##\s*(.*?)(?:\n|$)/g, "<h3 style='margin: 0.75em 0;'>$1</h3>")  
      // Convert bold text using '**'
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
      // Convert numbered lists (e.g., 1. First item)
      .replace(/(^|\n)(\d+\.)\s*(.*?)(?=\n|$)/g, "<li style='margin: 0.5em 0; list-style-type: decimal;'><strong>$2</strong> $3</li>")
      // Convert bullet points (* ) to list items without unnecessary breaks
      .replace(/(^|\n)\*\s+(.*?)(?=\n|$)/g, "<li style='margin: 0.5em 0; list-style-type: disc;'>$2</li>")
      // Convert line breaks to <br> only where necessary
      .replace(/(?:\r\n|\r|\n)/g, "<br>");
  
    // Wrap lists in <ul> or <ol> if any <li> is detected
    const wrappedContent = formattedContent.replace(/(<li[^>]*>.*?<\/li>)/g, "<ul style='padding-left: 20px;'>$1</ul>");
  
    return wrappedContent;
  };

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({}); // State for copy/check status

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      // Call the backend API
      const response = await axios.post("/api/chat", { messages: newMessages });

      // Update messages with the response data
      setMessages((current) => [...current, userMessage, { role: "system", content: response.data.content }]);

      // Reset the input field
      form.reset({ prompt: "" });
    } catch (error: any) {
      console.error("Error during chat generation:", error.response?.data || error.message || error);
      alert("An error occurred while generating the response. Please try again.");
    } finally {
      router.refresh();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus((prev) => ({ ...prev, [content]: true })); // Set the status to show the check icon
    setTimeout(() => setCopyStatus((prev) => ({ ...prev, [content]: false })), 2000); // Reset the status after 2 seconds
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
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
                className="rounded-lg border border-white/10 w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Can you explain the basics of machine learning?"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 lg:col-span-2 border border-white/10 hover:shadow-[0_2px_2px_rgba(255,255,255,0.3)] w-full"
                  disabled={isLoading}
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4 mt-4">
            {/* add true here instead of isLoading to view the loader in action */}
            {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
                <Loader />
              </div>
            )}
            {messages.length === 0 && !isLoading && (
              <Empty label="No Conversation Started." />
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div
                  key={message.content}
                  className={cn(
                    "p-8 w-full flex items-start gap-x-8 rounded-lg relative", // Added 'relative' to ensure button positioning
                    message.role === "user" ? "bg-black text-white border border-black/10" : "bg-black text-white"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <p
                    className="text-sm flex-1"
                    dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} // Render formatted content
                  />
                  {message.role === "system" && (
                    <button
                      className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                      onClick={() => handleCopy(message.content)}
                    >
                      {copyStatus[message.content] ? (
                        <Check className="text-green-500" size={20} />
                      ) : (
                        <Copy size={20} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Footer component */}
    </div>
  );
};

export default ConversationPage;
