import React from 'react';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    const typedChildren = children as React.ReactElement<
      React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >;

    const { className: childClassName, ...childProps } = typedChildren.props;
    const { className: slotClassName, ...slotProps } = props;

    return React.cloneElement(typedChildren, {
      ref,
      ...slotProps,
      ...childProps,
      className: [slotClassName, childClassName].filter(Boolean).join(' '),
    });
  }

  if (React.Children.count(children) > 1) {
    React.Children.only(null);
  }

  return null;
});

Slot.displayName = 'Slot';

export { Slot };
