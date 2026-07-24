<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260723155453 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE trip RENAME COLUMN available_seats TO available_seat');
        $this->addSql('ALTER TABLE vehicle RENAME COLUMN consumption_liter_per_100km TO consumption_liter_per100km');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE trip RENAME COLUMN available_seat TO available_seats');
        $this->addSql('ALTER TABLE vehicle RENAME COLUMN consumption_liter_per100km TO consumption_liter_per_100km');
    }
}
