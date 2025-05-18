"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleGenAI } from "@google/genai";
import styles from "@/Chat.module.css";
import { systemInstructionText } from "@/systemInstructionText";
import UserPrompt from "./ui_chat/UserPrompt";
import InputPrompt from "./ui_chat/InputPrompt";
import ResponseBox from "./ui_chat/ResponseBox";
import KamblokMarkdown from "./ui_chat/KamblokMarkdown";

export function Chat() {
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any>([]);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const stopRef = useRef<boolean>(false);
    const [hasSentMessage, setHasSentMessage] = useState<boolean>(false); // Track if a message has been sent

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setInput(e.target.value);
    // };

    const handleInputChange = (value: string) => {
        setInput(value);
    };

    const handleStop = () => {
        stopRef.current = true;
        setIsLoading(false);
        setMessages((prevMessages: any) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage.role === "model" && lastMessage.content === "") {
                return prevMessages.slice(0, -1);
            }
            return prevMessages.map((message: any) => {
                if (message.id === lastMessage.id && message.role === "model") {
                  return {
                      ...message,
                      content: message.content || "Response generation stopped.",
                  };
                }
                return message;
            });
        });
    };

    const getStreamResponse = async() => {
        const newMessage = {
            id: `model-${Date.now()}`,
            role: "model",
            content: "",
        };
        setMessages((prevMessages: any) => [...prevMessages, newMessage]);
        try {
            const GEMINI_API_KEY = process.env.GOOGLE_GENAI_API_KEY;
            if (!GEMINI_API_KEY) {
                throw new Error("API key is not defined");
            }
            const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
            const chatHistory = messages
                .filter((message: { role: string }) => message.role === "user" || message.role === "model")
                .map((msg: { role: any; content: any }) => ({
                    role: msg.role,
                    parts: [{ text: msg.content }],
                }));

            const messagesToSend = [{ role: "user", parts: [{ text: input }] }];

            const response = await ai.models.generateContentStream({
                config: {
                    responseMimeType: "text/plain",
                    systemInstruction: systemInstructionText,
                },
                model: "gemini-1.5-flash",
                // model: "gemini-2.5-flash-preview-04-17",
                contents: chatHistory.concat(messagesToSend),
            });

            let aiMessageContent = "";
            for await (const chunk of response) {
                if (stopRef.current) {
                    break;
                }

                aiMessageContent += chunk.text;
                setMessages((prevMessages: any) => {
                    if (stopRef.current) return prevMessages;
                    return prevMessages.map((message: any) => {
                        if (message.id === newMessage.id) {
                            return { ...message, content: aiMessageContent };
                        }
                        return message;
                    });
                });
            }

            if (!stopRef.current) {
                setMessages((prevMessages: any) => {
                    return prevMessages.map((message: any) => {
                        if (message.id === newMessage.id) {
                            return { ...message, content: aiMessageContent, role: "model" };
                        }
                        return message;
                    });
                });
            }
        } catch (error: any) {
            console.error("Failed to send message:", error.message);
            if (!stopRef.current) {
                setMessages((prevMessages: any) => [
                    ...prevMessages,
                    {
                        id: `model-${Date.now()}`,
                        role: "model",
                        content: "Failed to generate response.",
                    },
                ]);
            }
        } finally {
            setIsLoading(false);
            stopRef.current = false;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input,
        };

        setMessages((prevMessages: any) => [...prevMessages, userMessage]);
        setInput("");
        setIsLoading(true);
        stopRef.current = false;
        setHasSentMessage(true); // Mark that a message has been sent

        getStreamResponse();

    };

    const handleSave = (event: { value: string }) => {
        // console.log('Saved text:', event.value);
        const newInput = event.value;

        if (!newInput.trim()) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: newInput,
        };

        setMessages((prevMessages: any) => [...prevMessages, userMessage]);
        setInput("");
        setIsLoading(true);
        stopRef.current = false;
        setHasSentMessage(true); // Mark that a message has been sent

        getStreamResponse();
    };

    // Check if there are any messages with content
    const hasMessagesWithContent = messages.some((message: any) => message.content?.trim());

    return (
        <div className="flex flex-col">
            <div
                className={`flex flex-col ${hasMessagesWithContent ? "items-center" : "items-center justify-center"} flex-grow`}
                style={{ height: "calc(100vh - 60px)" }}
            >
                <div className={`overflow-y-auto ${styles.chatContainer}`}
                    ref={chatContainerRef}
                    style={{
                        height: hasSentMessage ? "100%" : 'auto',
                        width: hasMessagesWithContent ? "100%" : "fit-content",
                    }}
                >
                    <div className="px-6 m-auto"
                        style={{
                            maxWidth: "920px",
                        }}
                    >
                        <h3 className={`text-center ${hasMessagesWithContent ? "hidden" : "block"}`}>
                            What can Kamblok help today?
                        </h3>
                        {messages.map((message: any) => {
                            if (message.role === "user" || message.role === "model") {
                                return (
                                    <div
                                        key={message.id}
                                        className="flex w-full py-4"
                                        style={{
                                            justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                                        }}
                                    >
                                    {
                                    message.role === "user"
                                    ?
                                        <UserPrompt 
                                            rawContent={message.content}
                                            onSave={handleSave}
                                        >
                                            {message.content}
                                        </UserPrompt>
                                    :
                                    <>
                                        {message.content == "" && (
                                            <div
                                                className="mb-2 rounded-lg p-3 w-fit max-w-[80%] bg-muted text-muted-foreground"
                                                style={{ alignSelf: "flex-start" }}
                                            >
                                                Kamblok think...
                                            </div>
                                        )}
                                    
                                        <ResponseBox
                                            rawContent={message.content}
                                        >
                                            <KamblokMarkdown>
                                                {message.content}
                                            </KamblokMarkdown>
                                        </ResponseBox>
                                    </>
                                    }

                                </div>
                            );
                        }
                        return null;
                    })}
                    {/* {isLoading && (
                        <div
                            className="mb-2 rounded-lg p-3 w-fit max-w-[80%] bg-muted text-muted-foreground"
                            style={{ alignSelf: "flex-start" }}
                        >
                            Kamblok think...
                        </div>
                    )} */}
                    </div>
                </div>
            
                {/* <Card className={`m-4 ${hasMessagesWithContent ? "w-full" : "w-fit"}`} */}
                <div className={`mb-4 w-full px-6`}
                    style={{
                        maxWidth: "920px",
                    }}
                >
                   
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center space-x-2">
                            <InputPrompt 
                                placeholder="Ask Kamblok a question..."
                                value={input}
                                // disabled={true}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault(); // Prevent default behavior (e.g., adding a newline)
                                        handleSubmit(e); // Call the submit handler
                                    }
                                }}
                            >
                                <div className="flex">
                                    {isLoading ? (
                                    <Button
                                        className="hover:text-pink-400 rounded px-4 py-0"
                                        type="button"
                                        onClick={handleStop}
                                    >
                                        Stop
                                    </Button>
                                    ) : (
                                    <Button
                                        className="hover:text-pink-400 rounded px-4 py-0"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        Send
                                    </Button>
                                    )}
                                </div>
                            </InputPrompt>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}