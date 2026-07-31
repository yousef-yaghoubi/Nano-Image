import { http, HttpResponse } from 'msw';
import {
  mockPrompts,
  mockUsers,
  mockAdminOverview,
  mockQuantities,
} from './data';

const BASE = 'http://localhost:3000';

export const handlers = [
  http.get(`${BASE}/api/prompts`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    const tags = url.searchParams.get('tags');
    const sort = url.searchParams.get('sort');

    let filtered = [...mockPrompts];

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (tags) {
      const tagList = tags.split(',');
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => tagList.includes(t))
      );
    }

    if (sort) {
      const [field, dir] = sort.split(' ');
      filtered.sort((a, b) => {
        let cmp = 0;
        if (field === 'date')
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (field === 'likes') cmp = a.likes - b.likes;
        if (field === 'title') cmp = a.title.localeCompare(b.title);
        return dir === 'asc' ? cmp : -cmp;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: null,
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }),

  http.get(`${BASE}/api/prompts/quantity`, () =>
    HttpResponse.json({
      success: true,
      data: mockQuantities,
    })
  ),

  http.get(`${BASE}/api/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');
    const search = url.searchParams.get('search');
    const role = url.searchParams.get('role');

    let filtered = [...mockUsers];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: null,
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }),

  http.get(`${BASE}/api/favorites`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');

    const favorites = mockPrompts.filter((p) => p.isFavorited);
    const total = favorites.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = favorites.slice(start, start + limit);

    return HttpResponse.json({
      success: true,
      message: null,
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }),

  http.get(`${BASE}/api/favorites/ids`, () =>
    HttpResponse.json({
      success: true,
      data: mockPrompts
        .filter((p) => p.isFavorited)
        .map((p) => p._id.toString()),
    })
  ),

  http.get(`${BASE}/api/get-me/prompts`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '24');

    const userPrompts = mockPrompts.filter(
      (p) => p.creatorName === 'Test User'
    );
    const total = userPrompts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = userPrompts.slice(start, start + limit).map((p) => ({
      ...p,
      buttons: 'edit delete',
    }));

    return HttpResponse.json({
      success: true,
      data,
      allCount: total,
      totalCount: total,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }),

  http.get(`${BASE}/api/admin/overview`, () =>
    HttpResponse.json({
      success: true,
      data: mockAdminOverview,
    })
  ),

  http.post(`${BASE}/api/webhooks/clerk`, () =>
    HttpResponse.json({ success: true })
  ),
];
