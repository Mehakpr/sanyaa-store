import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
        size: String,
        color: String,
        image: String,
      },
    ],
    userId: { type: String },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    orderId: { type: String },
    paymentStatus: { type: String, default: "pending" },
    orderStatus: { type: String, default: "placed" },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
