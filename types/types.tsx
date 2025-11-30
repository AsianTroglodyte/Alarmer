export type Activity = {
    type: "math",
    difficulty: "very easy"|"easy"|"normal"|"hard"|"very hard"|"super hard"|"hell mode" 
    times: number
} | {
    type: "steps",
    stepsNumber: number // can't define bounds to number. maybe runtime check 
} | {
    type: "squat",
    squatsNumber: number
} | {
    type: "shake",
    difficulty: "very easy"|"easy"|"normal"|"hard"|"very hard"
    shakeNumber: number
} | {
    type: "photo",
    photos: []   
} | {
    type: "qrcode",
    qrcode: string
} | {
    type: "gotolocation",
    locationData: string
}

export interface SnoozeSettings {
    active: boolean;
    intervalMinutes: number;
    maxSnores: number;
}

export interface GentleWakeUpSettings {
    active: boolean;
    rampDurationSeconds: number;
}


export type AlarmDatum = {
    id: number,
    alarmName: string,
    daily: boolean,
    daysOfWeek: [
        { name: "sunday", active: boolean },
        { name: "monday", active: boolean},
        { name: "tuesday", active: boolean},
        { name: "wednesday", active: boolean },
        { name: "thursday", active: boolean},
        { name: "friday", active: boolean},
        { name: "saturday", active: boolean},
    ],
    time: Date,
    active: boolean,
    activities: Activity[]
    snooze: {
        active: boolean,
        intervalMinutes: number,
        maxSnores: number
    },
    gentleWakeUp: {
        active: boolean,
        rampDurationSeconds: number
    },
    vibrationsEnabled: boolean,
    extraLoudEnabled: boolean,
    volume: number,
}

export type AlarmsData = AlarmDatum[]