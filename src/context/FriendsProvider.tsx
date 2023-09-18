'use client';

import { UserDocument } from '@/models/User';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

type FriendsState = {
  friends: UserDocument[] | null;
  setFriends(friends: UserDocument[]): void;
  refetch: () => Promise<void>;
};

const FriendsContext = createContext<FriendsState | null>(null);

const useFriends = (): FriendsState => {
  const context = useContext(FriendsContext);

  if (!context) {
    throw new Error('Please use FriendsProvider in parent component');
  }

  return context;
};

export const FriendsProvider = (props: PropsWithChildren) => {
  const [friends, setFriends] = useState<UserDocument[] | null>(null);

  useEffect(() => {
    getFriends().then((f) => setFriends(f));
  }, []);

  async function getFriends(): Promise<UserDocument[] | null> {
    try {
      const res = await fetch(`http://localhost:3000/api/users/friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) return null;

      const { friends }: { friends: UserDocument[] } = await res.json();
      return friends;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const refetch = () => getFriends().then((f) => setFriends(f));

  return <FriendsContext.Provider value={{ friends, setFriends, refetch }}>{props.children}</FriendsContext.Provider>;
};

export default useFriends;
