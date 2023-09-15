'use client';

import { ChannelDocument } from '@/models/Channel';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

type ChannelState = {
  channel: ChannelDocument;
  setChannel(channel: ChannelDocument): void;
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
  const [channel, setChannel] = useState<ChannelDocument>({
    name: 'default-channel',
    channelType: 'DM'
  });

  return <ChannelContext.Provider value={{ channel, setChannel }}>{props.children}</ChannelContext.Provider>;
};

export default useChannel;
