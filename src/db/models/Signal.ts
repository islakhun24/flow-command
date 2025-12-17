import { Schema, model } from "mongoose"

export type SignalStatus =
    | "UNRESOLVED"
    | "WIN"
    | "LOSE"
    | "EXPIRED"

const SignalSchema = new Schema(
    {
        symbol: { type: String, required: true },
        bias: { type: String, required: true },
        confidence: { type: Number, required: true },

        timeframe: String,
        btcValid: Boolean,

        entry: Number,
        stopLoss: Number,
        takeProfit: [Number],

        reasons: [String],

        status: {
            type: String,
            enum: ["UNRESOLVED", "WIN", "LOSE", "EXPIRED"],
            default: "UNRESOLVED"
        }
    },
    { timestamps: true }
)

export const SignalModel = model("signals", SignalSchema)
