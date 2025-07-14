
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Shirt, Users, Home, LogOut, CreditCard, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, clear auth tokens/cookies
    router.push("/");
  };

  const getTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length < 2) return 'Dashboard';
    const title = segments[segments.length - 1].replace('-', ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="bg-primary/20 text-primary p-2 rounded-lg">
              <Shirt className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-semibold font-headline">Laundry Co.</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref>
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={pathname === "/dashboard"}
                >
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <Link href="/dashboard/laundry-orders" passHref>
                <SidebarMenuButton
                  tooltip="Laundry Orders"
                  isActive={pathname.startsWith("/dashboard/laundry-orders")}
                >
                  <ShoppingCart />
                  <span>Orders</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/packages" passHref>
                <SidebarMenuButton
                  tooltip="Laundry Packages"
                  isActive={pathname.startsWith("/dashboard/packages")}
                >
                  <Shirt />
                  <span>Packages</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/customers" passHref>
                <SidebarMenuButton
                  tooltip="Customers"
                  isActive={pathname.startsWith("/dashboard/customers")}
                >
                  <Users />
                  <span>Customers</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/payment-methods" passHref>
                <SidebarMenuButton
                  tooltip="Payment Methods"
                  isActive={pathname.startsWith("/dashboard/payment-methods")}
                >
                  <CreditCard />
                  <span>Payment Methods</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/perfumes" passHref>
                <SidebarMenuButton
                  tooltip="Perfumes"
                  isActive={pathname.startsWith("/dashboard/perfumes")}
                >
                  <Sparkles />
                  <span>Perfumes</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Log Out">
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 flex items-center gap-4 border-b">
          <SidebarTrigger className="md:hidden"/>
          <h2 className="text-xl font-semibold font-headline">
            {getTitle()}
          </h2>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
