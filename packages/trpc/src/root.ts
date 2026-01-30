import { router } from './trpc';
import { projectRouter } from './router/project';
import { userRouter } from './router/user';
import { contestRouter } from './router/contest';
import { hardwareRouter } from './router/hardware';
import { communityRouter } from './router/community';
import { commentRouter } from './router/comment';
import { searchRouter } from './router/search';
import { uploadRouter } from './router/upload';
import { tagRouter } from './router/tag';

export const appRouter = router({
  project: projectRouter,
  user: userRouter,
  contest: contestRouter,
  hardware: hardwareRouter,
  community: communityRouter,
  comment: commentRouter,
  search: searchRouter,
  upload: uploadRouter,
  tag: tagRouter,
});

export type AppRouter = typeof appRouter;
