import mongoose, { Types } from 'mongoose';
const Schema = mongoose.Schema;

export interface UserDocument {
  _id?: string;
  username: string;
  password: string;
  email: string;
  emailVerified?: boolean;
  image?: string;
  friends?: [UserDocument];
}

const UserSchema = new Schema<UserDocument>(
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

UserSchema.index({ username: 'text' });
UserSchema.on('index', (err) => {
  if (err) console.log(err.message);
  else console.log('Username index created!');
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
