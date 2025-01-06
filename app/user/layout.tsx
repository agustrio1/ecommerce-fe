import { Metadata } from "next"
import UserSidebar from "@/components/user/user-sidebar"

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Manage your account, orders, and preferences",
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <main className="flex-1 bg-gray-50 transition-all duration-300 ease-in-out mt-4 md:ml-16 md:mt-8 px-6 max-w-full sm:px-6 lg:px-8">
          {children}
      </main>
    </div>
  )
}

