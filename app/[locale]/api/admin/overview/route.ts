import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Prompts, Users } from '@/models';
import { cacheLife, cacheTag } from 'next/cache';
import { CacheTags } from '@/lib/cache';

const getCachedOverview = async () => {
  'use cache';

  cacheTag(CacheTags.admin);
  cacheLife('hours');

  await dbConnect();

  const [
    totalPrompts,
    likesResult,
    totalUsers,
    promptsByStatus,
    usersByRole,
    adminRequests,
    recentPrompts,
    recentUsers,
  ] = await Promise.all([
    Prompts.countDocuments(),
    Prompts.aggregate([
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } },
    ]),
    Users.countDocuments(),
    Prompts.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Users.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Users.countDocuments({ waitForAdmin: true }),
    Prompts.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title likes status createdAt')
      .lean(),
    Users.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role image createdAt')
      .lean(),
  ]);

  const totalLikes = likesResult[0]?.totalLikes || 0;

  const statusMap: Record<string, number> = {};
  for (const item of promptsByStatus) {
    statusMap[item._id] = item.count;
  }

  const roleMap: Record<string, number> = {};
  for (const item of usersByRole) {
    roleMap[item._id] = item.count;
  }

  return {
    totalPrompts,
    totalLikes: Math.floor(totalLikes / 100) * 100,
    totalUsers,
    activePrompts: statusMap['True'] || 0,
    pendingPrompts: statusMap['Pending'] || 0,
    rejectedPrompts: statusMap['False'] || 0,
    adminRequests,
    membersCount: roleMap['MEMBER'] || 0,
    adminsCount: (roleMap['ADMIN'] || 0) + (roleMap['SUPER_ADMIN'] || 0),
    recentPrompts: JSON.parse(JSON.stringify(recentPrompts)),
    recentUsers: JSON.parse(JSON.stringify(recentUsers)),
  };
};

export async function GET() {
  try {
    const data = await getCachedOverview();

    return NextResponse.json({
      success: true,
      message: null,
      data,
    });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching admin overview',
        data: null,
      },
      { status: 500 }
    );
  }
}
