import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

async function page() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h1>لطفا وارد حساب کاربری شوید.</h1>
        <div className="flex gap-2">
          <SignUpButton>
            <span className="cursor-pointer">ثبت نام</span>
          </SignUpButton>
          <SignInButton>
            <span className="cursor-pointer">ورود</span>
          </SignInButton>
        </div>
      </div>
    );
  }

  return <div>page</div>;
}

export default page;
