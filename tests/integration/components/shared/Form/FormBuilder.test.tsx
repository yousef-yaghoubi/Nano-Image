import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as yup from 'yup';
import FormBuilder from '@/components/shared/Form/FormBuilder';
import type { FieldConfig } from '@/types/form/types';

describe('FormBuilder', () => {
  const fields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Enter email',
    },
  ];

  const validationSchema = yup.object({
    name: yup.string().required('isRequired'),
    email: yup.string().email('invalidEmail'),
  });

  const initialValues = { name: '', email: '' };

  it('renders form with fields', () => {
    render(
      <FormBuilder
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={vi.fn()}
        submitLabel="Submit"
      />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submit button is disabled when form is empty and fields are required', async () => {
    render(
      <FormBuilder
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={vi.fn()}
        submitLabel="Submit"
      />
    );
    const btn = screen.getByRole('button', { name: /submit/i });
    expect(btn).toBeDisabled();
  });

  it('calls onSubmit with values when submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ status: true });
    const user = userEvent.setup();
    render(
      <FormBuilder
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        submitLabel="Submit"
      />
    );

    await user.type(screen.getByPlaceholderText('Enter name'), 'John');
    await user.type(
      screen.getByPlaceholderText('Enter email'),
      'john@test.com'
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('renders custom fields via render prop', () => {
    render(
      <FormBuilder
        fields={[]}
        initialValues={{ custom: '' }}
        validationSchema={yup.object({})}
        onSubmit={vi.fn()}
        customFields={() => <div data-testid="custom-field">Custom</div>}
      />
    );
    expect(screen.getByTestId('custom-field')).toBeInTheDocument();
  });

  it('shows loading state when isPending is true', () => {
    render(
      <FormBuilder
        fields={[]}
        initialValues={{}}
        validationSchema={yup.object({})}
        onSubmit={vi.fn()}
        isPending
        loadingMessageKey="saving"
      />
    );
    expect(screen.getByText('saving')).toBeInTheDocument();
  });
});
