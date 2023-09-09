import mongoose, { Document, Types } from 'mongoose';
const Schema = mongoose.Schema;

interface IUser extends Document {
  username: string;
  avatar: string;
  friends: [Types.ObjectId];
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    channels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Channel'
      }
    ]
  },
  { versionKey: false }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
