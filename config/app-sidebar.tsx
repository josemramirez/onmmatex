"use client";

import * as React from "react";
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "OnMMaTeX",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  teams: [{
    name: "Research Hub",
    logo: GalleryVerticalEnd,
    plan: "Enterprise"
  }, {
    name: "Academic Suite",
    logo: AudioWaveform,
    plan: "Startup"
  }, {
    name: "Pro Research",
    logo: Command,
    plan: "Free"
  }],
  navMain: [{
    title: "Research Lab",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [{
      title: "Research History",
      url: "#"
    }, {
      title: "Saved Reports",
      url: "#"
    }, {
      title: "Preferences",
      url: "#"
    }]
  }, {
    title: "AI Models",
    url: "#",
    icon: Bot,
    items: [{
      title: "Genesis Research",
      url: "#"
    }, {
      title: "Deep Explorer",
      url: "#"
    }, {
      title: "Quantum Analysis",
      url: "#"
    }]
  }, {
    title: "Help Center",
    url: "#",
    icon: BookOpen,
    items: [{
      title: "Quick Start Guide",
      url: "#"
    }, {
      title: "Research Basics",
      url: "#"
    }, {
      title: "Advanced Techniques",
      url: "#"
    }, {
      title: "Updates Log",
      url: "#"
    }]
  }, {
    title: "Configuration",
    url: "#",
    icon: Settings2,
    items: [{
      title: "Research Settings",
      url: "#"
    }, {
      title: "Collaboration",
      url: "#"
    }, {
      title: "Subscription",
      url: "#"
    }, {
      title: "Usage Metrics",
      url: "#"
    }]
  }],
  projects: [{
    name: "STEM Research",
    url: "#",
    icon: Frame
  }, {
    name: "Business Analytics",
    url: "#",
    icon: PieChart
  }, {
    name: "Academic Projects",
    url: "#",
    icon: Map
  }]
};
export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>;
}