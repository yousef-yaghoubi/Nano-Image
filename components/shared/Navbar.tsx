import { SignOutButton, SignUpButton, UserAvatar } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';

const navDetail = [
  { id: 1, label: 'home', link: '/' },
  { id: 2, label: 'about me', link: '/about' },
];

const ButtonSign = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border border-gray-500 px-4 py-2 cursor-pointer rounded-md">
      {children}
    </div>
  );
};
export default async function Navbar() {
  const { isAuthenticated } = await auth();
  const user = await currentUser();

  console.log(user);
  return (
    <div className="w-full h-14 md:h-20 border-b border-gray-200 flex justify-around items-center">
      <span className="text-xl md:text-3xl font-extrabold text-gray-600">
        Nano Image
      </span>
      <nav>
        <ul className="flex gap-4">
          {navDetail.map((li) => (
            <li key={li.id}>{li.label}</li>
          ))}
        </ul>
      </nav>
      {!isAuthenticated ? (
        <SignUpButton>
          <ButtonSign>Sign Up / Sign In</ButtonSign>
        </SignUpButton>
      ) : (
        <div className='flex gap-2'>
          <div className="flex gap-2 items-center">
            <UserAvatar />
            <span>{user?.emailAddresses[0].emailAddress}</span>
          </div>
          <ButtonSign>
            <SignOutButton />
          </ButtonSign>
        </div>
      )}
    </div>
  );
}
