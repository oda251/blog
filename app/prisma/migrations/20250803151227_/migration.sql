-- CreateEnum
CREATE TYPE "public"."DevLangCode" AS ENUM ('JS', 'TS', 'GAS');

-- CreateEnum
CREATE TYPE "public"."FrameworkCode" AS ENUM ('REACT', 'ASTRO', 'HONO', 'TAILWIND');

-- CreateTable
CREATE TABLE "public"."Tags" (
    "id" STRING NOT NULL,
    "name" STRING(128) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tweets" (
    "id" STRING NOT NULL,
    "content" STRING(1024) NOT NULL,
    "article" STRING(16384),
    "author" STRING(128),
    "ip_address" STRING(32),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tweets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vector" (
    "id" STRING NOT NULL,
    "source_id" STRING NOT NULL,
    "source_table" STRING(128) NOT NULL,
    "embedding" STRING NOT NULL,

    CONSTRAINT "Vector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "body" STRING NOT NULL,
    "author" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DevLangRelation" (
    "id" STRING NOT NULL,
    "code" "public"."DevLangCode" NOT NULL,

    CONSTRAINT "DevLangRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FrameworkRelation" (
    "id" STRING NOT NULL,
    "code" "public"."FrameworkCode" NOT NULL,

    CONSTRAINT "FrameworkRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Infra" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Infra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" STRING NOT NULL,
    "title_en" STRING NOT NULL,
    "title_ja" STRING NOT NULL,
    "thumbnail" STRING,
    "body" JSONB,
    "github" STRING,
    "href" STRING,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TweetTags" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_DevLangRelationToProduct" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_FrameworkRelationToProduct" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_InfraToProduct" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "public"."Tags"("name");

-- CreateIndex
CREATE INDEX "Tweets_id_idx" ON "public"."Tweets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Infra_name_key" ON "public"."Infra"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TweetTags_AB_unique" ON "public"."_TweetTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TweetTags_B_index" ON "public"."_TweetTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DevLangRelationToProduct_AB_unique" ON "public"."_DevLangRelationToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_DevLangRelationToProduct_B_index" ON "public"."_DevLangRelationToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FrameworkRelationToProduct_AB_unique" ON "public"."_FrameworkRelationToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FrameworkRelationToProduct_B_index" ON "public"."_FrameworkRelationToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InfraToProduct_AB_unique" ON "public"."_InfraToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_InfraToProduct_B_index" ON "public"."_InfraToProduct"("B");

-- AddForeignKey
ALTER TABLE "public"."Vector" ADD CONSTRAINT "Vector_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."Tweets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."_TweetTags" ADD CONSTRAINT "_TweetTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TweetTags" ADD CONSTRAINT "_TweetTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tweets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DevLangRelationToProduct" ADD CONSTRAINT "_DevLangRelationToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."DevLangRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DevLangRelationToProduct" ADD CONSTRAINT "_DevLangRelationToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FrameworkRelationToProduct" ADD CONSTRAINT "_FrameworkRelationToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."FrameworkRelation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FrameworkRelationToProduct" ADD CONSTRAINT "_FrameworkRelationToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InfraToProduct" ADD CONSTRAINT "_InfraToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Infra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_InfraToProduct" ADD CONSTRAINT "_InfraToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
