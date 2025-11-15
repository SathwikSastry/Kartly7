import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total_amount: number;
  status: string;
  transaction_id: string | null;
  payment_screenshot_url: string | null;
  admin_notes: string | null;
  products: any;
}

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onUpdate,
}: OrderDetailsDialogProps) {
  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateOrder = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status,
          admin_notes: adminNotes,
        })
        .eq("id", order.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSignedUrl = async (path: string | null) => {
    if (!path) return null;
    
    const { data } = await supabase.storage
      .from("payment_screenshots")
      .createSignedUrl(path.split("/").pop()!, 3600);
    
    return data?.signedUrl || null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>Order ID: {order.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
                <p><span className="text-muted-foreground">Email:</span> {order.email}</p>
                <p><span className="text-muted-foreground">Phone:</span> {order.phone}</p>
                <p><span className="text-muted-foreground">Address:</span> {order.address}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Total:</span> ₹{Number(order.total_amount).toLocaleString()}</p>
                <p><span className="text-muted-foreground">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                <p><span className="text-muted-foreground">UTR:</span> {order.transaction_id || "—"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Products</h3>
            <div className="bg-muted/50 rounded p-3">
              <pre className="text-sm overflow-auto">{JSON.stringify(order.products, null, 2)}</pre>
            </div>
          </div>

          {order.payment_screenshot_url && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Payment Screenshot</h3>
                <img
                  src={order.payment_screenshot_url}
                  alt="Payment screenshot"
                  className="max-w-full rounded border"
                />
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Order Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes about this order..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} disabled={loading}>
              {loading ? "Updating..." : "Update Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
