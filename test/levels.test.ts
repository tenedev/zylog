import { describe, expect, it } from 'vitest';
import { Zylog } from '../lib';
import { stderrBuffer, stdoutBuffer } from './setup';

describe('log levels', () => {
  it('should emit logs only if level is enabled', () => {
    const logger = new Zylog();

    logger.debug('debug message');
    expect(stdoutBuffer.join('')).toContain('');
    expect(stdoutBuffer.join('')).not.toContain('debug message');

    logger.info('info message');
    expect(stdoutBuffer.join('')).toContain('info message');
  });

  it('should emit logs for all levels correctly', () => {
    const logger = new Zylog({ level: 'trace' });

    logger.trace('trace');
    logger.debug('debug');
    logger.info('info');
    logger.success('success');
    expect(stdoutBuffer.join('')).toContain('trace');
    expect(stdoutBuffer.join('')).toContain('debug');
    expect(stdoutBuffer.join('')).toContain('info');
    expect(stdoutBuffer.join('')).toContain('success');

    logger.warn('warn');
    logger.error('error');
    logger.fatal('fatal');
    expect(stderrBuffer.join('')).toContain('warn');
    expect(stderrBuffer.join('')).toContain('error');
    expect(stderrBuffer.join('')).toContain('fatal');
  });
});

describe('isLevelEnabled', () => {
  it('should return true for enabled levels', () => {
    const logger = new Zylog({ level: 'warn' });
    expect(logger.isLevelEnabled('warn')).toBe(true);
    expect(logger.isLevelEnabled('error')).toBe(true);
    expect(logger.isLevelEnabled('info')).toBe(false);
  });

  it('should return false if silent is true', () => {
    const logger = new Zylog();
    logger.silent = true;
    expect(logger.isLevelEnabled('error')).toBe(false);
  });
});
