-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'RAZORPAY',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "shippingName" TEXT,
    "shippingPhone" TEXT,
    "shippingAddress" TEXT,
    "shippingCity" TEXT,
    "shippingPincode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "paymentMethod", "paymentStatus", "shippingAddress", "shippingCity", "shippingName", "shippingPhone", "shippingPincode", "status", "total", "userId") SELECT "createdAt", "id", "paymentMethod", "paymentStatus", "shippingAddress", "shippingCity", "shippingName", "shippingPhone", "shippingPincode", "status", "total", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
