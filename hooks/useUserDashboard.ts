import { useState, useEffect } from "react"
import { getToken } from "@/utils/token"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  order_id: string
  createdAt: string
  total: number
  status: string
}

interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
}

interface OrderStatusStats {
  [key: string]: number
}

export function useUserDashboard() {
  const { toast } = useToast()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [orderStatusStats, setOrderStatusStats] = useState<OrderStatusStats>({})

  useEffect(() => {
    const fetchAllOrders = async (userId: string, token: string) => {
      let allOrders: Order[] = []
      let page = 1
      const limit = 100 // Adjust this value based on your API's maximum limit
      let hasMoreData = true

      while (hasMoreData) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}?page=${page}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (!response.ok) {
          throw new Error("Gagal mengambil data pesanan.")
        }

        const data = await response.json()
        allOrders = [...allOrders, ...data.data]

        if (data.data.length < limit) {
          hasMoreData = false
        } else {
          page++
        }
      }

      return allOrders
    }

    const fetchData = async () => {
      try {
        const token = await getToken()
        if (!token) {
          toast({
            title: "Error",
            description: "Token tidak ditemukan. Harap login ulang.",
            variant: "destructive",
          })
          return
        }

        const userPayload = JSON.parse(atob(token.split(".")[1]))
        const userId = userPayload?.id
        setUserName(userPayload?.name || "Pengguna")

        if (!userId) {
          throw new Error("ID pengguna tidak ditemukan dalam token.")
        }

        const allOrders = await fetchAllOrders(userId, token)

        setRecentOrders(allOrders.slice(0, 5))

        const totalOrders = allOrders.length
        const totalSpent = allOrders.reduce((sum: number, order: Order) => sum + order.total, 0)
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

        setUserStats({
          totalOrders,
          totalSpent,
          averageOrderValue,
        })

        const statusCounts = allOrders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1
          return acc
        }, {} as OrderStatusStats)

        const totalOrdersCount = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)

        const orderStatusStatsPercentage = Object.entries(statusCounts).reduce((acc, [status, count]) => {
          acc[status] = (count / totalOrdersCount) * 100
          return acc
        }, {} as OrderStatusStats)

        setOrderStatusStats(orderStatusStatsPercentage)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Terjadi kesalahan.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  return { recentOrders, userStats, loading, userName, orderStatusStats }
}

