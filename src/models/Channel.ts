import mongoose, { Types } from 'mongoose';
import { UserDocument } from './User';
import { MessageDocument } from './Message';
const Schema = mongoose.Schema;

enum ChannelType {
  DM = 'DM',
  GROUP = 'GROUP'
}

export interface ChannelDocument {
  _id?: string;
  name: string;
  channelType: string;
  users?: [UserDocument];
  messages?: [MessageDocument];
}

const ChannelSchema = new Schema<ChannelDocument>(
  {
    name: {
      type: String,
      required: true
    },
    channelType: {
      type: String,
      required: true,
      enum: Object.values(ChannelType)
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  { versionKey: false }
);

export default mongoose.models.Channel || mongoose.model<ChannelDocument>('Channel', ChannelSchema);
