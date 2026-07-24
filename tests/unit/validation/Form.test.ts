import { describe, it, expect } from 'vitest';
import {
  SchemaSendPrompt,
  SchemaProfileEdit,
  SchemaImageUpdate,
  SchemaChangePassword,
  SchemaEditPrompt,
} from '@/validation/Form';

describe('SchemaSendPrompt', () => {
  it('passes with valid data', async () => {
    const result = await SchemaSendPrompt.validate({
      namePrompt: 'My Prompt',
      imageUrl: 'https://example.com/image.jpg',
      promptText: 'A beautiful scene with mountains and rivers',
      tags: ['Nature'],
    });
    expect(result.namePrompt).toBe('My Prompt');
  });

  it('fails when namePrompt is too short', async () => {
    await expect(
      SchemaSendPrompt.validate({
        namePrompt: 'AB',
        imageUrl: 'https://example.com/image.jpg',
        promptText: 'A valid prompt text here',
      })
    ).rejects.toThrow();
  });

  it('fails when imageUrl is not a URL', async () => {
    await expect(
      SchemaSendPrompt.validate({
        namePrompt: 'My Prompt',
        imageUrl: 'not-a-url',
        promptText: 'A valid prompt text here',
      })
    ).rejects.toThrow();
  });

  it('fails when promptText is too short', async () => {
    await expect(
      SchemaSendPrompt.validate({
        namePrompt: 'My Prompt',
        imageUrl: 'https://example.com/image.jpg',
        promptText: 'Short',
      })
    ).rejects.toThrow();
  });
});

describe('SchemaProfileEdit', () => {
  it('passes with empty values', async () => {
    const result = await SchemaProfileEdit.validate({});
    expect(result).toBeDefined();
  });

  it('passes with valid names', async () => {
    const result = await SchemaProfileEdit.validate({
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(result.firstName).toBe('John');
  });

  it('fails when firstName is too short', async () => {
    await expect(
      SchemaProfileEdit.validate({ firstName: 'Jo' })
    ).rejects.toThrow();
  });
});

describe('SchemaImageUpdate', () => {
  it('fails without a file', async () => {
    await expect(SchemaImageUpdate.validate({})).rejects.toThrow();
  });
});

describe('SchemaChangePassword', () => {
  it('passes with valid password', async () => {
    const result = await SchemaChangePassword.validate({
      newPassword: 'Str0ng!Pass',
      confirmPassword: 'Str0ng!Pass',
    });
    expect(result.newPassword).toBe('Str0ng!Pass');
  });

  it('fails when passwords do not match', async () => {
    await expect(
      SchemaChangePassword.validate({
        newPassword: 'Str0ng!Pass',
        confirmPassword: 'DifferentPass1!',
      })
    ).rejects.toThrow();
  });

  it('fails when password is too short', async () => {
    await expect(
      SchemaChangePassword.validate({
        newPassword: 'Sh0rt!',
        confirmPassword: 'Sh0rt!',
      })
    ).rejects.toThrow();
  });

  it('fails when missing lowercase', async () => {
    await expect(
      SchemaChangePassword.validate({
        newPassword: 'UPPERCASE123!',
        confirmPassword: 'UPPERCASE123!',
      })
    ).rejects.toThrow();
  });
});

describe('SchemaEditPrompt', () => {
  it('passes with at least one field filled', async () => {
    const result = await SchemaEditPrompt.validate({
      namePrompt: 'Updated Name',
    });
    expect(result.namePrompt).toBe('Updated Name');
  });

  it('fails when both fields are empty', async () => {
    await expect(
      SchemaEditPrompt.validate({ namePrompt: '', promptText: '' })
    ).rejects.toThrow();
  });
});
