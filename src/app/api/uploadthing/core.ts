import { getServerSession } from 'next-auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  messageAttachment: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const session = await getServerSession();
      if (!session) throw new Error('Unauthorized');

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Chat image upload complete for userId: ', metadata.userId);
      console.log('File url: ', file.url);
    }),
  profilePicture: f({ image: { maxFileSize: '8MB' } })
    .middleware(async ({ req }) => {
      const session = await getServerSession();
      if (!session) throw new Error('Unauthorized');

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Profile picture upload complete for userId: ', metadata.userId);
      console.log('File url: ', file.url);
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
