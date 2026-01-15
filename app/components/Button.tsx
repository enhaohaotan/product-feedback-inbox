import React from "react";

export default function Button({
  asChild = false,
  className = "",
  children,
  ...props
}) {
  const classes =
    "w-full md:w-auto bg-black text-white px-4 py-1 rounded-sm text-sm hover:cursor-pointer hover:opacity-80 flex items-center justify-center" +
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
