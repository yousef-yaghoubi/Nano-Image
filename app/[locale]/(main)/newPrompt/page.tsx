import NotAuthenticated from '@/components/shared/Auth/NotAuthenticated';
import SendPrompt from '@/components/shared/SendPrompt';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { auth } from '@clerk/nextjs/server';

async function page() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <SendPrompt clerkId={userId} />
    </MotionDiv>
  );
}

export default page;
