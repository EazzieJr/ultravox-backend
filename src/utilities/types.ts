export enum speakerenum {
    SPEAK_USER = "FIRST_SPEAKER_USER",
    SPEAK_AGENT = "FIRST_SPEAKER_AGENT",
    SPEAK_UNKNOWN = "FIRST_SPEAKER_UNSPECIFIED"
};

export enum outputmedium {
    VOICE = "MESSAGE_MEDIUM_VOICE",
    TEXT = "MESSAGE_MEDIUM_TEXT",
    UNKNOWN = "MESSAGE_MEDIUM_UNSPECIFIED"
};

export enum messagesroles {
    ROLE_USER = "MESSAGE_ROLE_USER",
    ROLE_AGENT = "MESSAGE_ROLE_AGENT",
    ROLE_CALL = "MESSAGE_ROLE_TOOL_CALL",
    ROLE_RESULT = "MESSAGE_ROLE_TOOL_RESULT",
    ROLE_UNKNOWN = "MESSAGE_ROLE_UNSPECIFIED"
};

export enum knownvalue {
    KNOWN_ID = "KNOWN_PARAM_CALL_ID",
    KNOWN_HISTORY = "KNOWN_PARAM_CONVERSATION_HISTORY",
    KNOWN_UNKNOWN = "KNOWN_PARAM_UNSPECIFIED"
};

export enum location {
    LOC_QUERY = "PARAMETER_LOCATION_QUERY",
    LOC_PATH = "PARAMETER_LOCATION_PATH",
    LOC_HEADER = "PARAMETER_LOCATION_HEADER",
    LOC_BODY = "PARAMETER_LOCATION_BODY",
    LOC_UNKNOWN = "PARAMETER LOCATION_UNSPECIFIED"
};