import mongoose, { Document, Types } from 'mongoose';
const Schema = mongoose.Schema;

interface IMessage {
  text: string;
  media?: string[];
  timestamp: Date;
  author: Types.ObjectId;
}

export type MessageDocument = IMessage & Document;

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      required: false
    },
    media: {
      type: [String],
      required: false
    },
    timestamp: {
      type: Date,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { versionKey: false }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
