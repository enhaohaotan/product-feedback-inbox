import {
    Links,
    Meta,
    Outlet,
    Scripts,
  } from "@remix-run/react";
import "./style.css";
  
  export default function App() {
    return (
      <html>
        <head>
          <link
            rel="icon"
            href="data:image/x-icon;base64,AA"
          />
          <Meta />
          <Links />
        </head>
        <body>
          <h1 className="underline">Hello world!</h1>
          <Outlet />
  
          <Scripts />
        </body>
      </html>
    );
  }
  