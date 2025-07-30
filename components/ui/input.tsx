import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-base border border-aluminum-600 bg-white px-4 py-3 text-body-large font-primary text-grounded ring-offset-white file:border-0 file:bg-transparent file:text-body-medium file:font-medium file:text-grounded placeholder:text-gray-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grounded focus-visible:ring-offset-2 focus-visible:border-grounded disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
