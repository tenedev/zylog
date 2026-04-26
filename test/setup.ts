import { beforeEach, vi } from 'vitest';

export let stdoutBuffer: string[] = [];
export let stderrBuffer: string[] = [];

beforeEach(() => {
  stdoutBuffer = [];
  stderrBuffer = [];

  vi.clearAllMocks();

  vi.spyOn(process, 'cwd').mockReturnValue('/mock/cwd');
  vi.spyOn(process, 'once').mockImplementation(() => process);

  vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
    stdoutBuffer.push(String(chunk));
    return true;
  });

  vi.spyOn(process.stderr, 'write').mockImplementation((chunk: unknown) => {
    stderrBuffer.push(String(chunk));
    return true;
  });
});

vi.mock('node:fs', () => ({
  createWriteStream: vi.fn(() => ({
    write: vi.fn(),
    end: vi.fn(),
  })),
  mkdirSync: vi.fn(),
}));
