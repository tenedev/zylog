import { expect, it } from 'vitest';
import { Zylog } from '../lib';

it('should initialize with default configuration', () => {
  const logger = new Zylog();

  expect(logger.config.level).toBe('info');
  expect(logger.config.cwd).toBe('/mock/cwd');
  expect(logger.config.prefix).toBe('');
  expect(logger.config.sep).toBe(' ');
  expect(logger.config.timestamp).toBe('utc');
  expect(logger.config.streams?.all).toBe('logs/zylog.log');
});

it('should apply color config if number is provided', () => {
  const logger = new Zylog({ colors: 0 });
  expect(logger.config.colors).toBeDefined();
});

it('should register process exit handlers', () => {
  new Zylog();
  expect(process.once).toHaveBeenCalledWith('exit', expect.any(Function));
  expect(process.once).toHaveBeenCalledWith('SIGINT', expect.any(Function));
  expect(process.once).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
});
