import { expect, it, vi } from 'vitest';
import { Zylog } from '../lib';

it('should handle timestamp=false', () => {
  const logger = new Zylog({ timestamp: false });
  const spy = vi.spyOn(process.stdout, 'write');
  logger.info('no ts');
  expect(spy).toHaveBeenCalledWith(expect.not.stringContaining('202'));
});

it('should handle empty prefix', () => {
  const logger = new Zylog();
  const spy = vi.spyOn(process.stdout, 'write');

  logger.info('no prefix');

  const output = spy.mock.calls?.[0]?.[0];

  expect(output).not.toContain('[ORIGINAL]');
  expect(output).not.toMatch(/\[.*\]/);
});
