import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelectDropdown } from './MultiSelectDropdown';

const options = [
  { value: 'fire', label: 'Fire' },
  { value: 'water', label: 'Water' },
  { value: 'grass', label: 'Grass' },
];

const renderDropdown = (props: Partial<React.ComponentProps<typeof MultiSelectDropdown>> = {}) => {
  const onToggle = vi.fn();
  render(
    <MultiSelectDropdown
      label="Type"
      options={options}
      selectedValues={[]}
      onToggle={onToggle}
      {...props}
    />
  );
  return { onToggle };
};

describe('MultiSelectDropdown', () => {
  it('renders the label on the trigger button and hides options initially', () => {
    renderDropdown();
    expect(screen.getByRole('button', { name: /type/i })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: 'Fire' })).not.toBeInTheDocument();
  });

  it('opens the panel and shows a checkbox per option when clicked', async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole('button', { name: /type/i }));
    expect(screen.getByRole('checkbox', { name: 'Fire' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Water' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Grass' })).toBeInTheDocument();
  });

  it('calls onToggle with the option value when a checkbox is clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderDropdown();
    await user.click(screen.getByRole('button', { name: /type/i }));
    await user.click(screen.getByRole('checkbox', { name: 'Water' }));
    expect(onToggle).toHaveBeenCalledWith('water');
  });

  it('reflects selected values as checked', async () => {
    const user = userEvent.setup();
    renderDropdown({ selectedValues: ['fire'] });
    await user.click(screen.getByRole('button', { name: /type/i }));
    expect(screen.getByRole('checkbox', { name: 'Fire' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Water' })).not.toBeChecked();
  });

  it('shows a count badge of the number of selected values', () => {
    renderDropdown({ selectedValues: ['fire', 'grass'] });
    const button = screen.getByRole('button', { name: /type/i });
    expect(within(button).getByText('2')).toBeInTheDocument();
  });

  it('closes the panel when Escape is pressed', async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByRole('button', { name: /type/i }));
    expect(screen.getByRole('checkbox', { name: 'Fire' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('checkbox', { name: 'Fire' })).not.toBeInTheDocument();
  });

  it('closes the panel when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button>outside</button>
        <MultiSelectDropdown label="Type" options={options} selectedValues={[]} onToggle={vi.fn()} />
      </div>
    );
    await user.click(screen.getByRole('button', { name: /type/i }));
    expect(screen.getByRole('checkbox', { name: 'Fire' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('checkbox', { name: 'Fire' })).not.toBeInTheDocument();
  });
});
