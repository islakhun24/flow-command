import { Schema, model } from "mongoose"

const PositionSchema = new Schema(
    {
        symbol: String,
        side: String,

        entry: Number,
        size: Number,

        status: {
            type: String,
            enum: ["OPEN", "CLOSED"],
            default: "OPEN"
        },

        pnl: Number,
        closeReason: String
    },
    { timestamps: true }
)

export const PositionModel = model("positions", PositionSchema)
