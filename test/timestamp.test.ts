import { expect, it, vi } from 'vitest';
import { Zylog } from '../lib';

it('should format local time (24h)', () => {
  const logger = new Zylog({ timestamp: 'locale', hourFormat: '24h' });
  const spy = vi.spyOn(process.stdout, 'write');

  logger.info('local time');

  expect(spy).toHaveBeenCalled();
});

it('should format local time (12h with AM/PM)', () => {
  const logger = new Zylog({ timestamp: 'locale', hourFormat: '12h' });
  const spy = vi.spyOn(process.stdout, 'write');

  logger.info('12h time');

  expect(spy).toHaveBeenCalledWith(expect.stringMatching(/AM|PM/));
});

it('should fallback safely if timestamp invalid', () => {
  // @ts-expect-error
  const logger = new Zylog({ timestamp: 'invalid' });
  const spy = vi.spyOn(process.stdout, 'write');

  logger.info('fallback');

  expect(spy).toHaveBeenCalled();
});
