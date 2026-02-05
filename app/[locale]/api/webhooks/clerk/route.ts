import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Favorite, PromptFavorite, Users } from '@/models';
import { ObjectId } from 'mongoose';
import { RoleType } from '@/models/roles';

// export const runtime = 'nodejs';.
// export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // ----------------------- 1. CHECK SECRET -----------------------
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });
  }

  // ----------------------- 2. HEADERS -----------------------
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // ----------------------- 3. GET RAW BODY (CRITICAL FIX) -----------------------
  // ⚠️ Must read as text first to preserve exact structure for verification
  const payload = await req.text();

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // ----------------------- 4. PROCESS EVENT -----------------------
  // Connect to DB only AFTER verification passes
  await dbConnect();

  const eventType = evt.type;
  console.log(`Webhook verified. Event Type: ${eventType}`);

  const ClerkC = await clerkClient();
  try {
    switch (eventType) {
      case 'user.created': {
        const { id, email_addresses, image_url, first_name, last_name } =
          evt.data;

        // if (!email_addresses || email_addresses.length === 0) {
        //   return new Response('No email found', { status: 400 });
        // }

        // Use findOneAndUpdate with upsert=true.
        // This handles "creation" AND "duplicates" automatically.
        const user = await Users.findOneAndUpdate(
          { clerkId: id },
          {
            clerkId: id,
            email: email_addresses[0].email_address,
            image: image_url,
            firstName: first_name || '',
            lastName: last_name || '',
            role: 'MEMBER',
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Ensure user has a Favorite list
        const favExists = await Favorite.findOne({ userId: user._id });
        if (!favExists) {
          await Favorite.create({ userId: user._id });
        }

        await ClerkC.users.updateUser(id, {
          publicMetadata: {
            role: user.role,
          },
        });

        console.log(`User created/synced: ${id}`);
        return new Response('User created', { status: 200 });
      }

      case 'user.updated': {
        const { id, email_addresses, image_url, first_name, last_name } =
          evt.data;

        // Update email, image, firstName, and lastName
        const updateData: {
          email?: string;
          image?: string;
          firstName?: string;
          lastName?: string;
        } = {};

        if (email_addresses?.[0]?.email_address) {
          updateData.email = email_addresses[0].email_address;
        }
        if (image_url) {
          updateData.image = image_url;
        }
        if (first_name !== undefined && first_name !== null) {
          updateData.firstName = first_name;
        }
        if (last_name !== undefined && last_name !== null) {
          updateData.lastName = last_name;
        }

        await Users.findOneAndUpdate({ clerkId: id }, updateData);

        console.log(`User updated: ${id}`);
        return new Response('User updated', { status: 200 });
      }

      case 'user.deleted': {
        const { id } = evt.data;

        const user = await Users.findOne({ clerkId: id });
        if (!user) {
          // Return 200 even if not found to stop Clerk from retrying
          return new Response('User not found, nothing to delete', {
            status: 200,
          });
        }

        const favorite = await Favorite.findOne({ userId: user._id });

        if (favorite) {
          await PromptFavorite.deleteMany({ favoriteId: favorite._id });
          await Favorite.deleteOne({ _id: favorite._id });
        }

        await Users.deleteOne({ _id: user._id });
        console.log(`User deleted: ${id}`);
        return new Response('User deleted', { status: 200 });
      }
      case 'session.created': {
        const userId = evt.data.user_id;

        // 1. Fetch user role from your DB
        const user = await Users.findOne({ clerkId: userId })
          .select('role')
          .lean<{ _id: ObjectId; role: RoleType }>();
        console.log('user: ', user);
        console.log('userId: ', userId);

        if (user) {
          // 2. Update publicMetadata (for future sessions)
          await ClerkC.users.updateUser(userId, {
            publicMetadata: {
              role: user.role,
            },
          });
        }

        console.log(`Session created for user: ${userId}`);
        return new Response('Session created', { status: 200 });
      }

      default:
        return new Response('Event type not handled', { status: 200 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
