import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntyties1678710985266 implements MigrationInterface {
    name = 'AddEntyties1678710985266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "bankId" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "balance" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions_categories_categories" ("transactionsId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_f92b6e68e2e2932e92d04d122bd" PRIMARY KEY ("transactionsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1c22ff6e19bc93cdfde96707f9" ON "transactions_categories_categories" ("transactionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1e3268ee96b358a6e963cae4e4" ON "transactions_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_f0ba5c9c85f3d118124d57c7dd8" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions_categories_categories" ADD CONSTRAINT "FK_1c22ff6e19bc93cdfde96707f9d" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transactions_categories_categories" ADD CONSTRAINT "FK_1e3268ee96b358a6e963cae4e4f" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions_categories_categories" DROP CONSTRAINT "FK_1e3268ee96b358a6e963cae4e4f"`);
        await queryRunner.query(`ALTER TABLE "transactions_categories_categories" DROP CONSTRAINT "FK_1c22ff6e19bc93cdfde96707f9d"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_f0ba5c9c85f3d118124d57c7dd8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e3268ee96b358a6e963cae4e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1c22ff6e19bc93cdfde96707f9"`);
        await queryRunner.query(`DROP TABLE "transactions_categories_categories"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
