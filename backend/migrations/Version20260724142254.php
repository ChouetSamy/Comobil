<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260724142254 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX uniq_7656f53ba26b1ffe');
        $this->addSql('DROP INDEX uniq_7656f53b2b1957e1');
        $this->addSql('CREATE INDEX IDX_7656F53B2B1957E1 ON trip (departure_address_id)');
        $this->addSql('CREATE INDEX IDX_7656F53BA26B1FFE ON trip (arrival_address_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_7656F53B2B1957E1');
        $this->addSql('DROP INDEX IDX_7656F53BA26B1FFE');
        $this->addSql('CREATE UNIQUE INDEX uniq_7656f53ba26b1ffe ON trip (arrival_address_id)');
        $this->addSql('CREATE UNIQUE INDEX uniq_7656f53b2b1957e1 ON trip (departure_address_id)');
    }
}
