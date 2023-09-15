import mongoose, { Document, Types } from 'mongoose';
const Schema = mongoose.Schema;

interface IUser {
  username: string;
  password: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  friends?: [Types.ObjectId];
}

export type UserDocument = IUser & Document;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Boolean,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
      }
    ]
  },
  { versionKey: false }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
