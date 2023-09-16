import mongoose, { Types } from 'mongoose';
import { UserDocument } from './User';
const Schema = mongoose.Schema;

export interface MessageDocument {
  _id?: string;
  text?: string;
  media?: string[];
  author: UserDocument;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    text: {
      type: String,
      required: false
    },
    media: {
      type: [String],
      required: false
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { versionKey: false, timestamps: true }
);

export default mongoose.models.Message || mongoose.model<MessageDocument>('Message', MessageSchema);
