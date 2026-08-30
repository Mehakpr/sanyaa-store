import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
