import colors from 'use-colors';
import { expect, it } from 'vitest';
import { Zylog } from '../lib';
import { stdoutBuffer } from './setup';

it('enableColors and disableColors', () => {
  const logger = new Zylog();
  logger.enableColors(1);
  logger.info('This should be red');
  expect(colors.hasAnsi(stdoutBuffer.join(''))).toBe(true);
  logger.enableColors(2);
  logger.info('This should be green');
  expect(colors.hasAnsi(stdoutBuffer.join(''))).toBe(true);
  logger.enableColors(3);
  logger.info('This should be blue');
  expect(colors.hasAnsi(stdoutBuffer.join(''))).toBe(true);
  logger.disableColors();
});
