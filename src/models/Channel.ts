import mongoose, { Types } from 'mongoose';
const Schema = mongoose.Schema;

enum ChannelType {
  DM = 'dm',
  GROUP = 'group'
}

interface IChannel {
  channelType: string;
  users: [Types.ObjectId];
  messages: [Types.ObjectId];
}

const ChannelSchema = new Schema(
  {
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
