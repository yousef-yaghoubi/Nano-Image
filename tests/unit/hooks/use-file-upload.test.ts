import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileUpload, formatBytes } from '@/hooks/use-file-upload';

function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(['x'.repeat(Math.max(1, size))], { type });
  const file = new File([blob], name, { type });
  return file;
}

let urlCount = 0;
beforeEach(() => {
  urlCount = 0;
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => {
    urlCount++;
    return `blob:test-${urlCount}`;
  });
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes to KB', () => {
    const result = formatBytes(2048);
    expect(result).toBe('2 KB');
  });

  it('formats bytes to MB', () => {
    const result = formatBytes(1048576);
    expect(result).toBe('1 MB');
  });

  it('formats bytes to GB', () => {
    const result = formatBytes(1073741824);
    expect(result).toBe('1 GB');
  });
});

describe('useFileUpload', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty state initially', () => {
    const [state] = renderHook(() => useFileUpload()).result.current;
    expect(state.files).toHaveLength(0);
    expect(state.isDragging).toBe(false);
    expect(state.errors).toHaveLength(0);
  });

  it('adds a file', () => {
    const file = createMockFile('test.jpg', 100, 'image/jpeg');
    const { result } = renderHook(() =>
      useFileUpload({
        maxSize: 1024 * 1024,
      })
    );

    act(() => {
      result.current[1].addFiles([file]);
    });

    expect(result.current[0].files).toHaveLength(1);
    expect(result.current[0].files[0].file.name).toBe('test.jpg');
  });

  it('rejects file exceeding max size', () => {
    const file = createMockFile('large.jpg', 10 * 1024 * 1024, 'image/jpeg');
    const { result } = renderHook(() =>
      useFileUpload({
        maxSize: 1024 * 1024,
      })
    );

    act(() => {
      result.current[1].addFiles([file]);
    });

    expect(result.current[0].files).toHaveLength(0);
    expect(result.current[0].errors.length).toBeGreaterThan(0);
  });

  it('removes a file by id', () => {
    const file = createMockFile('test.jpg', 100, 'image/jpeg');
    const { result } = renderHook(() =>
      useFileUpload({
        maxSize: 1024 * 1024,
      })
    );

    act(() => {
      result.current[1].addFiles([file]);
    });

    const fileId = result.current[0].files[0].id;

    act(() => {
      result.current[1].removeFile(fileId);
    });

    expect(result.current[0].files).toHaveLength(0);
  });

  it('clears all files', () => {
    const file = createMockFile('test.jpg', 100, 'image/jpeg');
    const { result } = renderHook(() =>
      useFileUpload({
        maxSize: 1024 * 1024,
      })
    );

    act(() => {
      result.current[1].addFiles([file]);
      result.current[1].clearFiles();
    });

    expect(result.current[0].files).toHaveLength(0);
  });

  it('tracks dragging state', () => {
    const { result } = renderHook(() => useFileUpload());

    const dragEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: { files: [] },
      currentTarget: document.createElement('div'),
      relatedTarget: null,
    } as unknown as React.DragEvent<HTMLElement>;

    act(() => {
      result.current[1].handleDragEnter(dragEvent);
    });
    expect(result.current[0].isDragging).toBe(true);
  });
});
