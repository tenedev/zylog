import { expect, it } from 'vitest';
import { Zylog } from '../lib';
import { stdoutBuffer } from './setup';

it('should apply temporary overrides for only one call', () => {
  const logger = new Zylog({ prefix: 'ORIGINAL' });

  logger.with({ prefix: 'OVERRIDE' }).info('message');
  expect(stdoutBuffer.join('')).toContain('[OVERRIDE]');

  logger.info('next');
  expect(stdoutBuffer.join('')).toContain('[ORIGINAL]');
});
