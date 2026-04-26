import { expect, it, vi } from 'vitest';
import { Zylog } from '../lib';

it('should measure execution time', async () => {
  const logger = new Zylog();
  const spy = vi.spyOn(logger, 'info');
  const result = await logger.measure('test-timer', () => 'done');
  expect(result).toBe('done');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('[timer:test-timer]'));
});

it('time and timeEnd should work', () => {
  const logger = new Zylog();
  const spy = vi.spyOn(logger, 'info');
  logger.time('manual');
  logger.timeEnd('manual');
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('[timer:manual]'));
});

it('timeEnd should ignore non-existent labels', () => {
  const logger = new Zylog();
  const spy = vi.spyOn(logger, 'info');
  logger.timeEnd('invalid');
  expect(spy).not.toHaveBeenCalled();
});
