import type { AlarmData } from "@/types/types";

export const alarms: AlarmData = [{
    id: 0, 
    repeating: true,
    daysOfWeek: ["sunday", "saturday"],
    time: "12:00 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
},
{
    id: 1, 
    repeating: true,
    daysOfWeek: ["sunday", "monday", "tuesday", 
        "wednesday", "thursday", "friday", "saturday"],
    time: "6:09 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
},
{
    id: 2, 
    repeating: true,
    daysOfWeek: ["sunday", "monday", "tuesday", 
        "wednesday", "thursday", "friday", "saturday"],
    time: "6:09 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
},
{
    id: 3, 
    repeating: true,
    daysOfWeek: ["sunday", "monday", "tuesday", 
        "wednesday", "thursday", "friday", "saturday"],
    time: "6:09 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
},
{
    id: 4, 
    repeating: true,
    daysOfWeek: ["sunday", "monday", "tuesday", 
        "wednesday", "thursday", "friday", "saturday"],
    time: "6:09 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
},
{
    id: 5, 
    repeating: true,
    daysOfWeek: ["sunday", "monday", "tuesday", 
        "wednesday", "thursday", "friday", "saturday"],
    time: "6:09 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
},
{
    id: 7, 
    repeating: true,
    daysOfWeek: ["sunday", "monday", "tuesday", 
        "wednesday", "thursday", "friday", "saturday"],
    time: "6:09 pm",
    active: true,
    activities: [
        {
            type: "math",
            difficulty: "easy",
            times: 3
        },
        {
            type: "steps",
            stepsNumber: 400, // min of 15 and max of 990
        },
    ],
    snooze: {
        intervalMinutes: 1,
        maxSnores: 3,
    },
    gentleWakeUp: true,
    vibrations: true,
    sound: true,
}];