import { Document, model, Schema } from "mongoose";

interface AgentDocument extends Document {
    agentId: string,
    name: string
};

const agentSchema = new Schema<AgentDocument>({
    agentId: {
        type: String,
        required: [true, "AgentID is required"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "name is required"]
    },
}, { timestamps: true });

export const AgentModel = model("Agent", agentSchema);