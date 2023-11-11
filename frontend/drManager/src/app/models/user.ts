export enum UserRole {
    NOT_SELECTED = -1,
    ADMIN = 1,
    PILOT = 2,
    PPO_REB = 3,
};

export interface User {

    _id?: string;
    login?: string;
    password?: string;
    role?: UserRole;
    userOptions?: {
        nickName?: string;
        operatorPhoneNumber?: string;
        spotterPhoneNumber?: string;
        unitNumber?: string;
        dronModel?: string;
        dronAppointment?: string;
        dronType?: string;
        discordUrl?: string;
    }
};