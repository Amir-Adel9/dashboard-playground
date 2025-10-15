import { Link } from '@tanstack/react-router'
import { Shield, Users } from 'lucide-react'

import logo from '@/_assets/logo.svg'
import { userStore } from '@/app/stores/user.store'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar'
import { isAuthorized } from '@/shared/lib/permissions'

const AppSidebar = () => {
  const sidebarItems: {
    label: string
    items: {
      label: string
      icon: any
      link: string
      isAuthorized: boolean
    }[]
  }[] = [
    {
      label: 'Management',
      items: [
        {
          label: 'Users',
          icon: Users,
          link: '/users',
          isAuthorized: isAuthorized({
            requiredPermissions: ['user_read'],
          }),
        },
        {
          label: 'Roles',
          icon: Shield,
          link: '/roles',
          isAuthorized: isAuthorized({
            requiredPermissions: ['role_read'],
          }),
        },
      ],
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar className="w-64">
        <SidebarHeader className="bg-secondary  p-5 flex items-center justify-center">
          <div className="">
            <Link to="/" className="block">
              <img src={logo} alt="Logo" className="text-white" />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-secondary p-4">
          {sidebarItems.map((group, index) => {
            if (group.items.every((item) => !item.isAuthorized)) return null

            return (
              <SidebarGroup key={index} className="mb-6">
                <SidebarGroupLabel className="text-muted  text-base font-semibold mb-2 tracking-wide">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items
                      .filter((item) => item.isAuthorized)
                      .map((item, index) => {
                        return (
                          <Link
                            to={item.link}
                            key={index}
                            className="block mb-1"
                          >
                            <SidebarMenuButton asChild>
                              <SidebarMenuItem className="rounded hover:bg-secondary-hovered transition-colors">
                                <item.icon className="mr-3 h-4 w-4 text-blue-100" />
                                <span className="text-sm font-medium text-white">
                                  {item.label}
                                </span>
                              </SidebarMenuItem>
                            </SidebarMenuButton>
                          </Link>
                        )
                      })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          })}
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger className="hidden max-md:inline h-16 bg-white p-5 rounded-none border-b border-border" />
    </SidebarProvider>
  )
}

export default AppSidebar
