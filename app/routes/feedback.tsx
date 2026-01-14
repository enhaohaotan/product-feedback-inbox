import { Outlet } from "@remix-run/react";
export default function Feedback() {
  return (
    <div>
      <div>My awesome feedbacks</div>
      <Outlet />
    </div>
  );
}
