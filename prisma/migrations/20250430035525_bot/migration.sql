-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "commands" INTEGER NOT NULL DEFAULT 0,
    "ranking" INTEGER NOT NULL DEFAULT 5,
    "alondioma" TEXT,
    "lastInteraction" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "spam" INTEGER NOT NULL DEFAULT 0,
    "bufunfas" INTEGER NOT NULL DEFAULT 0,
    "currentDailyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Daily" (
    "id" TEXT NOT NULL,
    "activations" INTEGER NOT NULL DEFAULT 0,
    "buttons" INTEGER NOT NULL DEFAULT 0,
    "menus" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "messages" INTEGER NOT NULL DEFAULT 0,
    "readMessages" INTEGER NOT NULL DEFAULT 0,
    "createdBufunfas" INTEGER NOT NULL DEFAULT 0,
    "transferedBufunfas" INTEGER NOT NULL DEFAULT 0,
    "rebackBufunfas" INTEGER NOT NULL DEFAULT 0,
    "botId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Daily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_currentDailyId_key" ON "Bot"("currentDailyId");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_currentDailyId_fkey" FOREIGN KEY ("currentDailyId") REFERENCES "Daily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daily" ADD CONSTRAINT "Daily_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
