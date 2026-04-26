import { expect, it } from 'vitest';
import zylog, { Zylog } from '../lib';

it('initialize zylog (class export)', () => {
  const logger = new Zylog();
  expect(logger).toBeInstanceOf(Zylog);
});

it('should be an instance of Zylog (default export)', () => {
  expect(zylog).toBeInstanceOf(Zylog);
});
