import { expect, it } from 'vitest';
import { Zylog } from '../lib';
import { stdoutBuffer } from './setup';

it('should log objects as formatted JSON', () => {
  const logger = new Zylog();
  logger.json({ foo: 'bar' });
  expect(stdoutBuffer.join('')).toContain('{\n  "foo": "bar"\n}');
});

it('should log objects with messages', () => {
  const logger = new Zylog();
  logger.json(
    { foo: 'bar' },
    {
      message: 'Test message',
    },
  );
  expect(stdoutBuffer.join('')).toContain('Test message {\n  "foo": "bar"\n}');
});

it('should log objects with custom levels', () => {
  const logger = new Zylog({
    level: 'debug',
  });

  logger.json(
    { foo: 'bar' },
    {
      level: 'debug',
    },
  );
  expect(stdoutBuffer.join('')).toContain('DEBUG');
});
