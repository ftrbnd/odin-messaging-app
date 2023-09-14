'use client';

import { Channel } from '@/types/channel-d';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

type ChannelState = {
  channel: Channel;
  setChannel(channel: Channel): void;
};

const ChannelContext = createContext<ChannelState | null>(null);

const useChannel = (): ChannelState => {
  const context = useContext(ChannelContext);

  if (!context) {
    throw new Error('Please use ChannelProvider in parent component');
  }

  return context;
};

export const ChannelProvider = (props: PropsWithChildren) => {
  const [channel, setChannel] = useState<Channel>({
    id: '-1',
    name: 'default',
    channelType: 'dm'
  });

  return <ChannelContext.Provider value={{ channel, setChannel }}>{props.children}</ChannelContext.Provider>;
};

export default useChannel;
