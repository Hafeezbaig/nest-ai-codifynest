/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import axios from "axios";
import * as z from "zod";
import { Heading } from "@/components/heading";
import { Code, Copy, Check } from "lucide-react";
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
import ReactMarkdown from "react-markdown";
import React from "react";
import remarkGfm from "remark-gfm";
import Footer from "@/components/footer";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

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
      const response = await axios.post("/api/code", { messages: newMessages });

      // Update messages with the response data
      setMessages((current) => [
        ...current,
        userMessage,
        { role: "system", content: response.data.content },
      ]);
    } catch (error: any) {
      console.error("Error during chat generation:", error.response?.data || error.message || error);
      alert("An error occurred while generating the response. Please try again.");
    } finally {
      // Reset the form field here
      form.reset();
      router.refresh();
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
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Heading
          title="Code Builder"
          description="Build and refine your code effortlessly with Nest AI."
          icon={Code}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
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
                          placeholder="How do I write a Python function to sort a list?"
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
                    "p-7 w-full flex items-start gap-x-8 rounded-lg relative", // Added relative class here
                    message.role === "user" ? "bg-black text-white border border-white/10" : "bg-black text-white border border-white/10"
                  )}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}

                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // GitHub flavored markdown for bullet points, lists, tables, etc.
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-2xl font-bold my-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-xl font-semibold my-2" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-lg font-semibold my-2" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-bold" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 my-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 my-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="my-1" {...props} />
                      ),
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-white/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code className="bg-white/20 rounded-lg p-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="my-2 leading-relaxed" {...props} /> // Add spacing between paragraphs
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.content || ""}
                  </ReactMarkdown>

                  {/* Copy Button */}
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
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CodePage;
