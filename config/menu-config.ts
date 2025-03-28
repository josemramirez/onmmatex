import { House, CreditCard, Users, Settings, ShieldCheck, ChartBarBig, Headset, MessageSquare, FilePlus2, FilePlus } from "lucide-react";
export const adminSidebarLinks = [{
  label: "Research Hub",
  icon: House,
  url: "/admin"
}, {
  label: "Active Researchers",
  icon: CreditCard,
  url: "/admin/subscribers"
}, {
  label: "Research Teams",
  icon: Users,
  url: "/admin/users"
}, {
  label: "Start New Research",
  icon: FilePlus,
  url: "/dashboard/new-chat"
}];
export const userSidebarLinks = [{
  label: "Analytics Center",
  icon: House,
  url: "/dashboard"
}, {
  label: "Research Plan",
  icon: CreditCard,
  url: "/dashboard/subscription"
}, {
  label: "Preferences",
  icon: Settings,
  url: "/dashboard/settings"
}, {
  label: "New Project",
  icon: FilePlus,
  url: "/dashboard/new-chat"
}];
export const userProfileLinks = [{
  label: "Admin Portal",
  icon: ShieldCheck,
  url: "/admin",
  isAdmin: true
}, {
  label: "Performance Metrics",
  icon: ChartBarBig,
  url: "/dashboard",
  isAdmin: false
}, {
  label: "Customization",
  icon: Settings,
  url: "/dashboard/settings",
  isAdmin: false
}, {
  label: "Research Assistance",
  icon: Headset,
  url: "#",
  isAdmin: false
}];