import { expect, it } from 'vitest';
import { Zylog } from '../lib';
import { stderrBuffer, stdoutBuffer } from './setup';

it('should get and set config', () => {
  const logger = new Zylog();

  expect(logger.config.level).toBe('info');
  expect(logger.config.prefix).toBe('');

  logger.config = { level: 'debug', prefix: 'TEST' };

  expect(logger.config.level).toBe('debug');
  expect(logger.config.prefix).toBe('TEST');

  logger.info('hello');
  const output = stdoutBuffer.join('');

  expect(output).toContain('[TEST]');
  expect(output).toContain('hello');
});

it('should get and set level', () => {
  const logger = new Zylog();

  expect(logger.level).toBe('info');

  logger.level = 'error';
  expect(logger.level).toBe('error');

  logger.info('skip');
  logger.error('show');

  const stdout = stdoutBuffer.join('');
  const stderr = stderrBuffer.join('');

  expect(stdout).not.toContain('skip');
  expect(stderr).toContain('show');
});

it('should get and set silent', () => {
  const logger = new Zylog();

  expect(logger.silent).toBe(false);

  logger.silent = true;
  expect(logger.silent).toBe(true);

  logger.info('hidden');

  expect(stdoutBuffer.length).toBe(0);
});

it('should get streams (initially empty)', () => {
  const logger = new Zylog();

  expect(logger.streams).toEqual([]);

  logger.info('stream check');

  const output = stdoutBuffer.join('');
  expect(output).toContain('stream check');
});

it('should respect level filtering', () => {
  const logger = new Zylog();

  logger.level = 'error';

  logger.info('should not log');
  logger.error('should log');

  const stdout = stdoutBuffer.join('');
  const stderr = stderrBuffer.join('');

  expect(stdout).not.toContain('should not log');
  expect(stderr).toContain('should log');
});

it('should not log when silent is enabled', () => {
  const logger = new Zylog();

  logger.silent = true;
  logger.info('hidden log');

  expect(stdoutBuffer.length).toBe(0);
});

it('should include prefix in logs', () => {
  const logger = new Zylog();

  logger.config = { prefix: 'TEST' };
  logger.info('hello');

  const output = stdoutBuffer.join('');

  expect(output).toContain('TEST');
  expect(output).toContain('hello');
});
