<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260716152925 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE adress ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE city ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE city_postal_code ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE fleet ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE "group" ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE group_member ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE message ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE moral_entity ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE notification ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE postal_code ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE preference ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE report ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE review ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE traveler ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE trip ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE trip_preference ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE "user" ADD token_version INT NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE "user" ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE vehicle ALTER uuid TYPE UUID USING uuid::uuid');
        $this->addSql('ALTER TABLE waypoint ALTER uuid TYPE UUID USING uuid::uuid');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE adress ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE city ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE city_postal_code ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE fleet ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "group" ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE group_member ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE message ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE moral_entity ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE notification ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE postal_code ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE preference ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE report ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE review ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE traveler ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE trip ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE trip_preference ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE "user" DROP token_version');
        $this->addSql('ALTER TABLE "user" ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE vehicle ALTER uuid TYPE VARCHAR(255)');
        $this->addSql('ALTER TABLE waypoint ALTER uuid TYPE VARCHAR(255)');
    }
}
