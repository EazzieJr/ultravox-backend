import { Document, model, Schema } from "mongoose";
import { knownvalue, location, messagesroles, outputmedium, speakerenum } from "../utilities/types";

interface AgentDocument extends Document {
    agentId: string,
    name: string,
    firstSpeaker?: string,
    inactivityMessgages?: object[],
    initialMessages?: object[],
    initialOutputMedium?: string,
    joinTimeout?: string,
    languageHint?: string,
    maxDuration?: string,
    medium?: object,
    model_name?: string,
    recordingEnabled?: boolean,
    selectedTools?: object[],
    systemPrompt?: string,
    temperature?: number,
    timeExceededMessage?: string,
    transcriptOptional?: boolean,
    vadSettings?: object,
    voice?: string,
    isActive: boolean
};

const agentSchema = new Schema<AgentDocument>({
    agentId: {
        type: String,
        required: [true, "AgentID is required"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "name is required"],
        default: "Simple TVAG Agent"
    },
    firstSpeaker: {
        type: String,
        enum: Object.values(speakerenum),
        default: speakerenum.SPEAK_USER
    },
    inactivityMessgages: [
        {
            duration: String,
            message: String,
            endBehavior: String,
            default: []
        }
    ],
    initialMessages: {
        callStageId: String,
        callStageMessageIndex: Number,
        errorDetails: String,
        invocationId: String,
        medium: {
            type: String,
            enum: Object.values(outputmedium)
        },
        role: {
            type: String,
            enum: Object.values(messagesroles)
        },
        text: String,
        toolName: String
    },
    initialOutputMedium: {
        type: String,
        enum: Object.values(outputmedium),
        default: outputmedium.VOICE
    },
    joinTimeout: {
        type: String
    },
    languageHint: {
        type: String
    },
    maxDuration: {
        type: String
    },
    medium: {
        plivo: {},
        serverWebSocket: {
            clientBufferSizeMs: {
                type: Number,
                default: 60
            },
            inputSampleRate: Number,
            outputSampleRate: Number
        },
        telnyx: {},
        twilio: {},
        webRtc: {}
    },
    model_name: {
        type: String,
        default: "fixie-ai/ultravox"
    },
    recordingEnabled: {
        type: Boolean,
        default: true
    },
    selectedTools: [
        {
            toolId: String,
            toolName: String,
            temporaryTool: {
                modelToolName: String,
                description: String,
                automaticParameters: [
                    {
                        name: String,
                        knownValue: {
                            type: String,
                            enum: Object.values(knownvalue)
                        },
                        location: {
                            type: String,
                            enum: Object.values(location)
                        }
                    }
                ],
                client: {},
                dynamicParameters: [
                    {
                        location: {
                            type: String,
                            enum: Object.values(location)
                        },
                        name: String,
                        required: Boolean,
                        schema: {}
                    }
                ],
                http: {
                    baseUrlPattern: String,
                    httpMethod: String
                },
                precomputable: Boolean,
                requirements: {
                    httpSecurityOptions: {
                        options: [
                            {
                                requirements: {
                                    type: Map, // Use a Map to allow dynamic keys
                                    of: new Schema(
                                        {
                                            queryApiKey: {
                                                name: {
                                                    type: String,
                                                }
                                            },
                                            headerApiKey: {
                                                name: {
                                                    type: String
                                                }
                                            },
                                            httpAuth: {
                                                scheme: {
                                                    type: String
                                                }
                                            },
                                        },
                                        { _id: false } // Disable _id for inner schema
                                    ),
                                },
                            }
                        ]
                    }
                },
                staticParameters: [
                    {
                        location: {
                            type: String,
                            enum: Object.values(location)
                        },
                        name: String,
                        value: Schema.Types.Mixed
                    }
                ],
                timeout: String
            }
        }
    ],
    systemPrompt: {
        type: String
    },
    temperature: {
        type: Number,
        default: 0
    },
    timeExceededMessage: {
        type: String
    },
    transcriptOptional: {
        type: Boolean,
        default: true
    },
    vadSettings: {
        minimumInterruptionDuration: String,
        minimumTurnDuration: String,
        turnEndpointDelay: String
    },
    voice: {
        type: String
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

export const AgentModel = model("Agent", agentSchema);