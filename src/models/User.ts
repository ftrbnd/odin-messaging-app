import mongoose, { Document, Types, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  username: string;
  password?: string;
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
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    authMethod: {
      type: String,
      required: true
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
