-- CreateTable
CREATE TABLE "InquirySubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "product" TEXT NOT NULL DEFAULT '',
    "scenario" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "locale" TEXT NOT NULL DEFAULT 'zh',
    "source" TEXT NOT NULL DEFAULT 'contact',
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "InquirySubmission_createdAt_idx" ON "InquirySubmission"("createdAt");

-- CreateIndex
CREATE INDEX "InquirySubmission_email_idx" ON "InquirySubmission"("email");
