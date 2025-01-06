import { Document, model, Schema } from "mongoose";

interface AgentDocument extends Document {
    agentId: string,
    name: string,
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
        required: [true, "name is required"]
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true });

export const AgentModel = model("Agent", agentSchema);