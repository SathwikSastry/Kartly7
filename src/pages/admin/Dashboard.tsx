import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total orders
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Fetch total revenue
      const { data: ordersData } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("status", "Completed");

      const totalRevenue = ordersData?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ) || 0;

      // Fetch total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Fetch pending orders
      const { count: pendingCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "Pending Verification");

      setStats({
        totalOrders: ordersCount || 0,
        totalRevenue,
        totalProducts: productsCount || 0,
        pendingOrders: pendingCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "All time orders",
      color: "text-blue-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      description: "Completed orders",
      color: "text-green-500",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Active products",
      color: "text-purple-500",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Users,
      description: "Awaiting verification",
      color: "text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Kartly7 Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-md bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="backdrop-blur-md bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your store operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products"
              className="p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-accent transition-colors"
            >
              <Package className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Manage Products</h3>
              <p className="text-sm text-muted-foreground">Add, edit, or delete products</p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border border-border/50 rounded-lg hover:border-primary/50 hover:bg-accent transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">View Orders</h3>
              <p className="text-sm text-muted-foreground">Track and update order status</p>
            </a>
            <div className="p-4 border border-border/50 rounded-lg opacity-50">
              <TrendingUp className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-semibold text-foreground">Analytics</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
