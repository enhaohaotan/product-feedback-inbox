import { Outlet } from "@remix-run/react";
export default function Feedback() {
  return (
    <div>
      <div>My awesome feedbacks</div>
      <Outlet />
    </div>
  );
}
// routeA.routeB.routeC_.routeD -> routeA/routeB/routeC/routeD
// routeA.routeB.routeC.routeD.routeE -> routeA/routeB/routeC/routeD/routeE
