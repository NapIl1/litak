import { ValueColor } from "./droneModel";

export enum FlightSteps {
    START = 0,
    FLIGHT = 1,
    LBZ_FORWARD = 2,
    RETURN = 3,
    LBZ_HOME = 4,
    REDUCTION = 5,
    END = 6
}

export interface FlightStep {
    step?: number;
    isApproved?: boolean;

    isApprovedByPPO?: boolean;
    isApprovedByREB?: boolean;

    visibleStep?:number;
}

export interface Flight {
    _id?: string;
    operator?: string;
    operatorPhone?: string;
    spotterPhone?: string;
    brigade?: string;
    staffUnit?: string;
    assignment?: ValueColor;
    model?: ValueColor;
    controlRange?: ValueColor;
    videoRange?: ValueColor;
    workingHeight?: string;
    taskPerformanceArea?: string;

    dateOfFlight?: Date;

    routeForward?: string;
    routeBack?: string;

    discordUrl?: string; // ?
    isInDiscord?: boolean;

    flightStartDate?: Date;
    isFlightStarted?: boolean;

    LBZForwardDate?: Date;
    isLBZForward?: boolean;

    isForwardChanged?: boolean;
    changedForwardRoute?: string;

    returnDate?: Date;
    isReturnChanged?: boolean;
    changedReturnRoute?: string;

    boardingStatus?: ValueColor;

    LBZBackDate?: Date;
    isLBZBack?: boolean;

    reductionDate?: Date;
    reductionDistance?: number;
    reductionLocation?: string;

    langingStatus?: ValueColor;

    endDate?: Date;

    ppoPhone?: string; // ?
    rebPhone?: string; // ?

    userId?: string;

    isRejected?: boolean;
    rejectedReason?: string;
    isRejectedbyPPO?: boolean;
    isRejectedbyREB?: boolean;

    isTerminated?: boolean;

    flightStep: FlightStep;

    isSectionCollapsed: boolean;

    isChecked?: boolean;
}