import { Channel } from './channel-d';
import { User } from './user-d';

export type Message = {
  id: string;
  text: string;
  timestamp: Date;
  author?: User;
  authorId?: string;
  channel?: Channel;
  channelId?: string;
};
