import dbConnect from '@/lib/dbConnect';
import Channel, { ChannelDocument } from '@/models/Channel';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await dbConnect();
    const channel = await Channel.findById<ChannelDocument>(id);

    return NextResponse.json({ channel }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}

// add a new user to the current channel
// currently, this allows multiple group chats with the same users
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { addedUserId }: { addedUserId: string } = await request.json();

  try {
    let channel = await Channel.findById(id);

    if (channel?.channelType === 'DM') {
      // create a new GROUP channel
      const newChannel = new Channel({
        channelType: 'GROUP',
        users: channel.users?.concat(addedUserId)
      });

      const channelExists = await Channel.findOne<ChannelDocument>({
        users: { $all: newChannel.users, $size: newChannel.users.length }
      }).populate([
        {
          path: 'users',
          populate: {
            path: 'friends'
          }
        },
        { path: 'messages', populate: { path: 'author' } }
      ]);
      if (channelExists) {
        return NextResponse.json({ channel: channelExists }, { status: 200 });
      }

      await newChannel.save();

      channel = await newChannel.populate([
        {
          path: 'users',
          populate: {
            path: 'friends'
          }
        },
        { path: 'messages', populate: { path: 'author' } }
      ]);

      return NextResponse.json({ channel: newChannel }, { status: 200 });
    } else {
      // add the user to the current GROUP channel
      channel?.users?.push(addedUserId);

      const channelExists = await Channel.findOne<ChannelDocument>({
        users: { $all: channel.users, $size: channel.users.length }
      }).populate([
        {
          path: 'users',
          populate: {
            path: 'friends'
          }
        },
        { path: 'messages', populate: { path: 'author' } }
      ]);
      if (channelExists) {
        return NextResponse.json({ channel: channelExists }, { status: 200 });
      }

      await channel.save();

      channel = await channel.populate([
        {
          path: 'users',
          populate: {
            path: 'friends'
          }
        },
        { path: 'messages', populate: { path: 'author' } }
      ]);

      return NextResponse.json({ channel }, { status: 200 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}
