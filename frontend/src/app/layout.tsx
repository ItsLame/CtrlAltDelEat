import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";

import { theme } from "~/theme";
import "@/styles/globals.scss";

export const metadata = {
  title: "CtrlAltDelEat",
  description: "The only waiting management system.",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript
        />
        <link
          rel="CtrlAltDelEat logo"
          href="/logo.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
