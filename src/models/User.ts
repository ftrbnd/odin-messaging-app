import mongoose, { Document, Types, Schema } from 'mongoose';

interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  avatar: string;
  friends: [Types.ObjectId];
  channels: [Types.ObjectId];
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
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

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
