import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex-center h-screen bg-[#5b708366]">{children}</div>;
}
