import FormUpdateUser from '@/components/shared/FormUpdateUser';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';

async function page() {
  const user = await currentUser();

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col items-center gap-3">
        <Image
          alt="user image"
          src={user?.imageUrl as string}
          width={250}
          height={250}
          className="rounded-full ring-4 ring-primary p-2 w-64 h-64"
        />
        <h3 className="heading-5">{user?.fullName}</h3>
        <h3 className="heading-5">{user?.emailAddresses[0].emailAddress}</h3>
      </div>
      <FormUpdateUser />
    </div>
  );
}

export default page;
