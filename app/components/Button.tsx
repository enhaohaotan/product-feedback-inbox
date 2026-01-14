import React from "react";

export default function Button({
  asChild = false,
  className = "",
  children,
  ...props
}) {
  const classes =
    "bg-black text-white px-2 py-1 rounded-sm text-sm hover:cursor-pointer hover:opacity-80 inline-flex items-center " +
    className;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      className: classes + " " + (children.props.className ?? ""),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
