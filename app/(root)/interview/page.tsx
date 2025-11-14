"use client";

import React, { useState } from "react";
import Agent from "../../../components/Agent";

// Define CallStatus locally in page.tsx
enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

const Page = () => {
    const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);

    const handleStartCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        // Simulate connection delay
        setTimeout(() => {
            setCallStatus(CallStatus.ACTIVE);
        }, 2000);
    };

    const handleEndCall = () => {
        setCallStatus(CallStatus.FINISHED);
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Interview Generation</h3>
            <Agent
                userName="You"
                callStatus={callStatus}
                onStartCall={handleStartCall}
                onEndCall={handleEndCall}
            />
        </div>
    );
};

export default Page;