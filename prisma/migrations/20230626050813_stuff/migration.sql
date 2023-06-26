-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Line" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "price" DECIMAL(9,2) NOT NULL,
    "shopifyOrderId" TEXT,
    "aspenOrderId" TEXT,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopifyOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackingNumber" TEXT NOT NULL,

    CONSTRAINT "ShopifyOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AspenOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "officeName" TEXT NOT NULL,
    "ordoroLink" TEXT NOT NULL,
    "createdBy" TEXT,
    "trackingNumber" TEXT,
    "fileAway" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "AspenOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DelinquentCustomer" (
    "id" TEXT NOT NULL,
    "price" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DelinquentCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyOrder_orderNumber_key" ON "ShopifyOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ShopifyOrder_trackingNumber_key" ON "ShopifyOrder"("trackingNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AspenOrder_orderNumber_key" ON "AspenOrder"("orderNumber");
