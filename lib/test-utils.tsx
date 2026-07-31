import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import type { ReactNode, CSSProperties } from 'react';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('next-intl/server', () => ({
  getTranslations: () => Promise.resolve((key: string) => key),
  getLocale: () => Promise.resolve('en'),
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: () => Promise.resolve({ isAuthenticated: false, userId: null }),
}));

afterEach(() => {
  cleanup();
});

vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key;
    t.rich = (key: string) => key;
    return t;
  },
  useLocale: () => 'en',
  NextIntlClientProvider: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('next/navigation', () => {
  const stableSearchParams = new URLSearchParams();
  return {
    useRouter: () => ({
      replace: vi.fn(),
      push: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }),
    usePathname: () => '/en/prompts',
    useSearchParams: () => stableSearchParams,
    useParams: () => ({ locale: 'en' }),
    notFound: () => {
      throw new Error('notFound called');
    },
    redirect: () => {
      throw new Error('redirect called');
    },
  };
});

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    fill,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    [key: string]: unknown;
  }) => {
    const style: CSSProperties | undefined = fill
      ? { position: 'absolute', inset: 0, width: '100%', height: '100%' }
      : undefined;
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        {...props}
      />
    );
  },
}));

vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'test_user_1',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      imageUrl: '/test-avatar.png',
    },
  }),
  useAuth: () => ({
    userId: 'test_user_1',
    isSignedIn: true,
    isLoaded: true,
  }),
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  SignUpButton: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  UserButton: () => <div data-testid="user-button" />,
  UserAvatar: ({ fallback }: { fallback?: ReactNode }) => (
    <div data-testid="user-avatar">{fallback}</div>
  ),
  ClerkProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignedIn: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignedOut: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenuContent: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-content" {...props}>
      {children}
    </div>
  ),
  DropdownMenuItem: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dropdown-item" {...props}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuRadioGroup: (props: {
    children: ReactNode;
    value?: string;
    onValueChange?: (v: string) => void;
  }) => (
    <div data-testid="radio-group" data-value={props.value}>
      {props.children}
    </div>
  ),
  DropdownMenuRadioItem: ({
    children,
    value,
    ...props
  }: {
    children: ReactNode;
    value?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="radio-item" data-value={value} {...props}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: ReactNode }) => (
    <div data-testid="sheet">{children}</div>
  ),
  SheetTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="sheet-content" {...props}>
      {children}
    </div>
  ),
  SheetHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SheetDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div data-testid="dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="dialog-trigger">{children}</div>
  ),
  DialogContent: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({
    children,
    open,
  }: {
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div data-testid="drawer" data-open={open}>
      {children}
    </div>
  ),
  DrawerTrigger: ({ children }: { children: ReactNode }) => (
    <div data-testid="drawer-trigger">{children}</div>
  ),
  DrawerContent: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="drawer-content" {...props}>
      {children}
    </div>
  ),
  DrawerHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DrawerTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DrawerDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  TooltipTrigger: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="tooltip-trigger" onClick={onClick}>
      {children}
    </div>
  ),
  TooltipContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
  TooltipProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: ReactNode;
    onValueChange?: (value: string) => void;
    value?: string;
  }) => (
    <div data-testid="select" data-value={value}>
      <select onChange={(e) => onValueChange?.(e.target.value)} value={value}>
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <div data-testid="select-trigger" {...props}>
      {children}
    </div>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectGroup: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
  SelectValue: () => <span />,
}));

vi.mock('@/components/ui/pagination', () => ({
  Pagination: ({
    children,
    ...props
  }: {
    children: ReactNode;
    [key: string]: unknown;
  }) => <nav {...props}>{children}</nav>,
  PaginationContent: ({ children }: { children: ReactNode }) => (
    <ul>{children}</ul>
  ),
  PaginationItem: ({ children }: { children: ReactNode }) => (
    <li>{children}</li>
  ),
  PaginationLink: ({
    children,
    isActive,
    href,
    onClick,
  }: {
    children: ReactNode;
    isActive?: boolean;
    href?: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick} data-active={isActive}>
      {children}
    </a>
  ),
  PaginationPrevious: ({
    href,
    onClick,
  }: {
    href?: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      Previous
    </a>
  ),
  PaginationNext: ({
    href,
    onClick,
  }: {
    href?: string;
    onClick?: () => void;
  }) => (
    <a href={href} onClick={onClick}>
      Next
    </a>
  ),
  PaginationEllipsis: () => <span>...</span>,
}));

vi.mock('motion', () => {
  const MotionTag = ({
    children,
    className,
    ...props
  }: {
    children: ReactNode;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div className={className} {...props}>
      {children}
    </div>
  );
  MotionTag.displayName = 'MotionDiv';
  return {
    motion: new Proxy(
      {},
      {
        get: () => MotionTag,
      }
    ),
  };
});
