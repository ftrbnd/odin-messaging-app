import { Channel } from './channel-d';
import { Message } from './message-d';

export type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  emailVerified: Date;
  image: string;
  channelIds?: string[];
  channels?: Channel[];
  messages?: Message[];
  friendOf?: User[];
  friendOfIds?: string[];
  friends?: User[];
  friendIds?: string[];
};
