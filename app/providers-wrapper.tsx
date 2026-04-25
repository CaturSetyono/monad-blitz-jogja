"use client";

import dynamic from "next/dynamic";
import type { PropsWithChildren } from "react";

const Providers = dynamic(() => import("./providers"), { ssr: false });

export default function ProvidersWrapper({ children }: PropsWithChildren) {
  return <Providers>{children}</Providers>;
}
