import mongoose, { Document, Types } from 'mongoose';
const Schema = mongoose.Schema;

enum ChannelType {
  DM = 'DM',
  GROUP = 'GROUP'
}

interface IChannel {
  name: string;
  channelType: string;
  users?: [Types.ObjectId];
  messages?: [Types.ObjectId];
}

export type ChannelDocument = IChannel & Document;

const ChannelSchema = new Schema(
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

export default mongoose.models.Channel || mongoose.model<IChannel>('Channel', ChannelSchema);
