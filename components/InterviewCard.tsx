import dayjs from "dayjs";
import Image from "next/image";
import React from 'react'
import {getRandomInterviewCover} from "@/lib/utils"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "@/components/DisplayTechIcons";

interface Feedback {
    createdAt?: Date;
    totalScore?: number;
    finalAssessment?: string;
}

interface InterviewCardProps {
    interviewId: string;
    userId: string;
    role: string;
    type: string;
    techstack: string[];
    createdAt: Date;
    feedback?: Feedback;
}

const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt, feedback }: InterviewCardProps) => {
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D YYYY');

    return (
        <div className={"card-border w-[360px] max-sm:w-full min-h-96"}>
            <div className={"card-interview p-6"}>
                <div className={"absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600"}>
                    <p className={"badge-text"}>{normalizedType}</p>
                </div>

                <Image
                    src={getRandomInterviewCover()}
                    alt="cover image"
                    width={90}
                    height={90}
                    className={"rounded-full object-cover size-[90px]"}
                />

                <h3 className={"mt-5 capitalize"}>
                    {role} Interview
                </h3>

                <div className={"flex flex-row gap-5 mt-3 items-center"}>
                    <div className={"flex flex-row gap-2 items-center"}>
                        <Image src={"/calendar.svg"} alt={"calendar"} width={22} height={22} />
                        <p>{formattedDate}</p>
                    </div>
                    <div className={"flex flex-row gap-2 items-center"}>
                        <Image src={"/star.svg"} alt={"star"} width={22} height={22} />
                        <p>{feedback?.totalScore || '---'}/100</p>
                    </div>
                </div>

                <p className={"line-clamp-2 mt-5"}>
                    {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
                </p>
            </div>

            <div className={"flex flex-row justify-between items-center p-4"}>
                <DisplayTechIcons techStack={techstack} /> {/* Fixed: added = sign */}

                <Button className={"btn-primary"}>
                    <Link href={feedback
                        ? `/interview/${interviewId}/feedback`
                        :`/interview/${interviewId}`
                    }>
                        {feedback ? 'Check Feedback' : 'View Interview'}
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default InterviewCard;