'use client';

import { ChannelDocument } from '@/models/Channel';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

type ChannelState = {
  channel: ChannelDocument | null;
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
  const [channel, setChannel] = useState<ChannelDocument | null>(null);

  useEffect(() => {
    async function getLatestChannel(): Promise<ChannelDocument | null> {
      try {
        const res = await fetch(`http://localhost:3000/api/channels`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) return null;

        const { channels }: { channels: ChannelDocument[] } = await res.json();
        return channels[0];
      } catch (err) {
        console.error(err);
        return null;
      }
    }

    getLatestChannel().then((ch) => setChannel(ch));
  }, []);

  return <ChannelContext.Provider value={{ channel, setChannel }}>{props.children}</ChannelContext.Provider>;
};

export default useChannel;
