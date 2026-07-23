<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260722144253 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX uniq_bf5476caa5bc2e0e');
        $this->addSql('CREATE INDEX IDX_BF5476CAA5BC2E0E ON notification (trip_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_BF5476CAA5BC2E0E');
        $this->addSql('CREATE UNIQUE INDEX uniq_bf5476caa5bc2e0e ON notification (trip_id)');
    }
}
