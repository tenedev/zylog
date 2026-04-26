import { createWriteStream, mkdirSync } from 'node:fs';
import { expect, it, vi } from 'vitest';
import { Zylog } from '../lib';

it('createStream should do nothing if no streams config', () => {
  const logger = new Zylog({ streams: { all: '' } });
  logger.createStream();
  expect(logger.streams).toEqual([]);
});

it('createStream should initialize write streams', () => {
  const logger = new Zylog({
    streams: {
      all: 'all.log',
      levels: { error: 'error.log' },
    },
  });
  logger.createStream();

  expect(mkdirSync).toHaveBeenCalled();
  expect(createWriteStream).toHaveBeenCalledTimes(2);
  expect(logger.streams).toContain('all.log');
  expect(logger.streams).toContain('error.log');
});

it('createStream should skip if level file is undefined', () => {
  const logger = new Zylog({
    streams: {
      levels: { error: '' },
    },
  });
  logger.createStream();
  expect(createWriteStream).not.toHaveBeenCalled();
});

it('closeStream should end all streams', () => {
  const logger = new Zylog({ streams: { all: 'all.log' } });
  logger.createStream();
  const streamMock = vi.mocked(createWriteStream).mock.results[0]?.value;

  logger.closeStream();
  expect(streamMock.end).toHaveBeenCalled();
  expect(logger.streams).toEqual([]);
});

it('writeStream should write to files when enabled', () => {
  const logger = new Zylog({
    streams: {
      all: 'all.log',
      levels: { info: 'info.log' },
    },
  });
  logger.createStream();
  const allStream = vi.mocked(createWriteStream).mock.results[0]?.value;
  const infoStream = vi.mocked(createWriteStream).mock.results[1]?.value;

  logger.info('to file');
  expect(allStream.write).toHaveBeenCalledWith(expect.stringContaining('to file'));
  expect(infoStream.write).toHaveBeenCalledWith(expect.stringContaining('to file'));
});

it('writeStream should do nothing if streams disabled', () => {
  const logger = new Zylog({ streams: { all: 'all.log' } });
  logger.info('not to file');
  expect(createWriteStream).not.toHaveBeenCalled();
});

it('createStream should not re-open existing streams', () => {
  const logger = new Zylog({ streams: { all: 'all.log' } });
  logger.createStream();
  const firstCallCount = vi.mocked(createWriteStream).mock.calls.length;
  logger.createStream();
  expect(vi.mocked(createWriteStream).mock.calls.length).toBe(firstCallCount);
});

it('should not write if stream disabled (force path)', () => {
  const logger = new Zylog({
    streams: { all: 'all.log' },
  });

  const spy = vi.spyOn(process.stdout, 'write');

  logger.info('no stream');

  expect(spy).toHaveBeenCalled();
  expect(createWriteStream).not.toHaveBeenCalled();
});

it('should write only to "all" stream when no level match', () => {
  const logger = new Zylog({
    streams: { all: 'all.log' },
  });

  logger.createStream();

  const stream = vi.mocked(createWriteStream).mock.results[0]?.value;

  logger.info('only all');

  expect(stream.write).toHaveBeenCalled();
});

it('should write only to level stream (no all)', () => {
  const logger = new Zylog({
    streams: { levels: { error: 'err.log' } },
  });

  logger.createStream();

  const stream = vi.mocked(createWriteStream).mock.results[0]?.value;

  logger.error('only level');

  expect(stream.write).toHaveBeenCalled();
});

it('should fallback to default streams when streams is undefined', () => {
  const logger = new Zylog({ streams: undefined });

  logger.createStream();

  expect(createWriteStream).toHaveBeenCalled();
});

it('should handle undefined cwd in stream path', () => {
  const logger = new Zylog({
    cwd: undefined,
    streams: { all: 'test.log' },
  });

  logger.createStream();

  expect(createWriteStream).toHaveBeenCalled();
});

it('should strip ANSI colors before writing to file', () => {
  const logger = new Zylog({
    streams: { all: 'all.log' },
  });

  logger.createStream();

  const stream = vi.mocked(createWriteStream).mock.results[0]?.value;

  logger.enableColors();
  logger.info('\x1b[31mred text\x1b[0m');

  const written = stream.write.mock.calls[0][0];

  expect(written).not.toMatch(/\\x1b/);
});
