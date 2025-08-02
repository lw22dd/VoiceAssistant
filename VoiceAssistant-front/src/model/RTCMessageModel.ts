// src/model/RTCMessageModel.ts
export interface RTCMessage {
    type: string;
    call?: string;    // offer
    answer?: string;  // answer
    candidate?: string;
}
