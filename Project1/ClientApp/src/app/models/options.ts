import { ValueColor } from "./droneModel";

export interface DroneOptions {
    _id?: string;
    boardingStatuses?: ValueColor[];
    dronAppointment?: ValueColor[];
    dronModels?: ValueColor[];

    flightStatus?: ValueColor[];
}