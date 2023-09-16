import mongoose from 'mongoose';
import { UserDocument } from './User';
import { MessageDocument } from './Message';
const Schema = mongoose.Schema;

enum ChannelTypeEnum {
  DM = 'DM',
  GROUP = 'GROUP'
}

type ChannelType = 'DM' | 'GROUP';

export interface ChannelDocument {
  _id?: string;
  channelType: ChannelType;
  users?: UserDocument[];
  messages?: MessageDocument[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ChannelSchema = new Schema<ChannelDocument>(
  {
    channelType: {
      type: String,
      required: true,
      enum: Object.values(ChannelTypeEnum)
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
  { versionKey: false, timestamps: true }
);

export default mongoose.models.Channel || mongoose.model<ChannelDocument>('Channel', ChannelSchema);
