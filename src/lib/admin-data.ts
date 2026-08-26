import { db } from "@/lib/db";

export async function getAdminOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      deliveryName: true,
      deliveryPhone: true,
      deliveryAddress: true,
      deliveryCity: true,
      total: true,
      paymentStatus: true,
      paymentNote: true,
      createdAt: true,
    },
  });

  return orders.map((order) => ({
    ...order,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
  }));
}

export async function getAdminInquiries() {
  const inquiries = await db.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      status: true,
      createdAt: true,
      product: { select: { name: true } },
    },
  });

  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    name: inquiry.name,
    phone: inquiry.phone,
    status: inquiry.status,
    productName: inquiry.product?.name ?? "—",
    createdAt: inquiry.createdAt.toISOString(),
  }));
}

export async function getAdminInventory() {
  const variants = await db.productVariant.findMany({
    orderBy: [{ product: { name: "asc" } }, { sku: "asc" }],
    select: {
      id: true,
      sku: true,
      stock: true,
      price: true,
      product: { select: { name: true } },
    },
  });

  return variants.map((variant) => ({
    id: variant.id,
    productName: variant.product.name,
    sku: variant.sku,
    stock: variant.stock,
    price: Number(variant.price),
  }));
}

export async function getAdminProducts() {
  const products = await db.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      category: { select: { id: true, name: true } },
      _count: { select: { variants: true } },
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.category.id,
    categoryName: product.category.name,
    variantCount: product._count.variants,
  }));
}

export async function getAdminCategories() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
  return categories;
}

export async function getAdminProductById(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      categoryId: true,
    },
  });
  return product;
}
