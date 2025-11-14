"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface AgentProps {
    userName: string;
    callStatus: CallStatus;
    onStartCall: () => void;
    onEndCall: () => void;
}

const Agent = ({
                   userName,
                   callStatus,
                   onStartCall,
                   onEndCall
               }: AgentProps) => {
    const isSpeaking = callStatus === CallStatus.ACTIVE;
    const messages = [
        'Whats your name?',
        'My name is Sravanthi, nice to meet you!'
    ];
    const lastMessage = messages[messages.length - 1];

    return (
        <div className="flex flex-col items-center gap-8 p-8">
            {/* --- AI and User Cards --- */}
            <div className="flex justify-center items-center gap-10">
                {/* --- AI Interviewer Card --- */}
                <div className="relative flex flex-col items-center justify-center w-[280px] h-[340px] rounded-2xl bg-gradient-to-b from-[#241B4D] to-[#0A0A1A] text-center shadow-lg border border-[#3A3A4D]">
                    <div className="relative">
                        <div className={cn(
                            "w-28 h-28 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300",
                            isSpeaking && "animate-talking-gentle"
                        )}>
                            <Image
                                src="/ai-avatar.png"
                                alt="AI Interviewer"
                                width={70}
                                height={70}
                                className="object-contain"
                            />
                        </div>
                        {/* Speaking indicator waves */}
                        {isSpeaking && (
                            <>
                                <span className="absolute -inset-3 rounded-full border-2 border-green-400/50 animate-talking-wave-1" />
                                <span className="absolute -inset-4 rounded-full border-2 border-green-400/30 animate-talking-wave-2" />
                            </>
                        )}
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-[#D0CFFF]">
                        AI Interviewer {isSpeaking && "🗣️"}
                    </h3>
                </div>

                {/* --- You Card --- */}
                <div className="flex flex-col items-center justify-center w-[280px] h-[340px] rounded-2xl bg-gradient-to-b from-[#18191C] to-black text-center shadow-lg border border-[#3A3A4D]">
                    <div className="w-28 h-28 rounded-full bg-white overflow-hidden flex items-center justify-center">
                        <Image
                            src="/user-avatar.png"
                            alt="You"
                            width={120}
                            height={120}
                            className="object-cover"
                        />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-[#C7C8FF]">{userName}</h3>
                </div>
            </div>

            {messages.length > 0 && (
                <div className="w-full max-w-2xl p-6 border border-gray-500/40 rounded-xl bg-white/5 backdrop-blur-sm"> {/* Lighter background and border */}
                    <div className="text-center">
                        <p key={lastMessage} className="text-white text-lg font-normal"> {/* Changed to font-normal */}
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}

            <div className="w-full flex justify-center mt-4">
                {callStatus === CallStatus.ACTIVE ? (
                    <button
                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-lg transition-all"
                        onClick={onEndCall}
                    >
                        End Call
                    </button>
                ) : (
                    <button
                        className="relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
                        onClick={onStartCall}
                        disabled={callStatus === CallStatus.CONNECTING}
                    >
                        {callStatus === CallStatus.CONNECTING && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
                        )}
                        <span>
                            {callStatus === CallStatus.INACTIVE && "Start Call"}
                            {callStatus === CallStatus.CONNECTING && "Connecting..."}
                            {callStatus === CallStatus.FINISHED && "Call Again"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Agent;