import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import "./style.css";

export default function App() {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}
