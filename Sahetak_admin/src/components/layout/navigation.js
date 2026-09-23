import {
  ClipboardList,
  Image as ImageIcon,
  LayoutDashboard,
  Package,
  Percent,
  UserCircle,
  Users,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    type: "link",
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    label: "Products",
    to: "/products",
    icon: Package,
  },
  {
    type: "group",
    label: "Promotions & Packs",
    icon: Percent,
    children: [
      { label: "Promotions", to: "/promotions" },
      { label: "Packs", to: "/packs" },
    ],
  },
  {
    type: "link",
    label: "Orders",
    to: "/orders",
    icon: ClipboardList,
  },
  {
    type: "group",
    label: "Admins",
    icon: Users,
    superAdminOnly: true,
    children: [
      { label: "Admins list", to: "/admins" },
      { label: "Create admin", to: "/admins/create" },
    ],
  },
  {
    type: "link",
    label: "Site settings",
    to: "/settings",
    icon: ImageIcon,
  },
  {
    type: "link",
    label: "Profile",
    to: "/profile",
    icon: UserCircle,
  },
];
