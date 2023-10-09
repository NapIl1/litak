import { ValueColor } from "./droneModel";

export enum FlightSteps {
    START = 0,
    FLIGHT = 1,
    LBZ_FORWARD = 2,
    RETURN = 3,
    LBZ_HOME = 4,
    END = 5
}

export interface FlightStep {
    step?: number;
    isApproved?: boolean;
}

export interface Flight {
    id: string;
    operator?: string;
    operatorPhone?: string;
    spotterPhone?: string;
    assignment?: ValueColor;
    model?: ValueColor;
    controlRange?: ValueColor;
    videoRange?: ValueColor;

    dateOfFlight?: Date;

    routeForward?: string;
    routeBack?: string;

    discordUrl?: string; // ?
    isInDiscord?: boolean;

    flightStartDate?: Date;
    isFlightStarted?: boolean;

    LBZForwardDate?: Date;
    isLBZForward?: boolean;

    returnDate?: Date;
    isReturnStarted?: boolean;
    returnRoute?: ValueColor;

    LBZBackDate?: Date;
    isLBZBack?: boolean;

    langingStatus?: ValueColor;

    ppoPhone?: string; // ?
    rebPhone?: string; // ?

    flightStep: FlightStep;

    test?: number;
}