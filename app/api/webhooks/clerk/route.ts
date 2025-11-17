import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Important: Configure route to accept raw body
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = (await headerPayload).get('svix-id');
    const svix_timestamp = (await headerPayload).get('svix-timestamp');
    const svix_signature = (await headerPayload).get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers');
      return new Response('Error occurred -- no svix headers', {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return new Response('Server configuration error', {
        status: 500,
      });
    }

    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occurred', {
        status: 400,
      });
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, email_addresses } = evt.data;

      // Check if email exists
      if (!email_addresses || email_addresses.length === 0) {
        return new Response('No email found', { status: 400 });
      }

      try {
        // Create user with default role MEMBER
        const user = await prisma.users.create({
          data: {
            clerkId: id,
            email: email_addresses[0].email_address,
            role: 'MEMBER', // Default role
          },
        });

        // Optionally create a Favorite record for the user
        await prisma.favorite.create({
          data: {
            userId: user.id,
          },
        });

        console.log('User created in database:', id);
        return new Response('User created successfully', { status: 200 });
      } catch (error) {
        console.error('Error creating user:', error);
        return new Response('Error creating user', { status: 500 });
      }
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses } = evt.data;

      if (!email_addresses || email_addresses.length === 0) {
        return new Response('No email found', { status: 400 });
      }

      try {
        await prisma.users.update({
          where: { clerkId: id },
          data: {
            email: email_addresses[0].email_address,
          },
        });

        console.log('User updated in database:', id);
        return new Response('User updated successfully', { status: 200 });
      } catch (error) {
        console.error('Error updating user:', error);
        return new Response('Error updating user', { status: 500 });
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      try {
        // Find the user first to get their ID
        const user = await prisma.users.findUnique({
          where: { clerkId: id },
          include: { favorite: true },
        });

        if (!user) {
          return new Response('User not found', { status: 404 });
        }

        // Delete related Favorite and PromptFavorites (cascade)
        if (user.favorite) {
          // Delete all PromptFavorites first
          await prisma.promptFavorite.deleteMany({
            where: { favoriteId: user.favorite.id },
          });

          // Delete the Favorite
          await prisma.favorite.delete({
            where: { id: user.favorite.id },
          });
        }

        // Delete the user
        await prisma.users.delete({
          where: { clerkId: id },
        });

        console.log('User deleted from database:', id);
        return new Response('User deleted successfully', { status: 200 });
      } catch (error) {
        console.error('Error deleting user:', error);
        return new Response('Error deleting user', { status: 500 });
      }
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (err) {
    return NextResponse.json({'error' : err})
  }
}
// 5. For Pages Router (pages/api/webhooks/clerk.ts):
/*
import { buffer } from 'micro';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = (await buffer(req)).toString();
  const headers = req.headers;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': headers['svix-id'],
      'svix-timestamp': headers['svix-timestamp'],
      'svix-signature': headers['svix-signature'],
    }) as WebhookEvent;
  } catch (err) {
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;

    if (!email_addresses || email_addresses.length === 0) {
      return res.status(400).json({ error: 'No email found' });
    }

    try {
      const user = await prisma.users.create({
        data: {
          clerkId: id,
          email: email_addresses[0].email_address,
          role: 'MEMBER',
        },
      });

      await prisma.favorite.create({
        data: {
          userId: user.id,
        },
      });

      return res.status(200).json({ message: 'User created' });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Error creating user' });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses } = evt.data;

    try {
      await prisma.users.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0].email_address,
        },
      });

      return res.status(200).json({ message: 'User updated' });
    } catch (error) {
      return res.status(500).json({ error: 'Error updating user' });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      const user = await prisma.users.findUnique({
        where: { clerkId: id },
        include: { favorite: true },
      });

      if (user?.favorite) {
        await prisma.promptFavorite.deleteMany({
          where: { favoriteId: user.favorite.id },
        });

        await prisma.favorite.delete({
          where: { id: user.favorite.id },
        });
      }

      await prisma.users.delete({
        where: { clerkId: id },
      });

      return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
  }

  return res.status(200).json({ message: 'Success' });
}
*/

// 6. Optional: Utility function to sync existing Clerk users
// Run this once to backfill existing users
/*
import { clerkClient } from '@clerk/nextjs/server';

export async function syncExistingUsers() {
  const users = await clerkClient.users.getUserList();

  for (const clerkUser of users) {
    try {
      const existingUser = await prisma.users.findUnique({
        where: { clerkId: clerkUser.id },
      });

      if (!existingUser && clerkUser.emailAddresses.length > 0) {
        const user = await prisma.users.create({
          data: {
            clerkId: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            role: 'MEMBER',
          },
        });

        await prisma.favorite.create({
          data: {
            userId: user.id,
          },
        });

        console.log('Synced user:', clerkUser.id);
      }
    } catch (error) {
      console.error('Error syncing user:', clerkUser.id, error);
    }
  }
}
*/
