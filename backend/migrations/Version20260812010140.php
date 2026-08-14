<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260812010140 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet ALTER adress_id DROP NOT NULL');
        $this->addSql('ALTER TABLE trip DROP total_seat');
        $this->addSql('ALTER TABLE trip DROP trip_status_default');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet ALTER adress_id SET NOT NULL');
        $this->addSql('ALTER TABLE trip ADD total_seat INT NOT NULL');
        $this->addSql('ALTER TABLE trip ADD trip_status_default VARCHAR(255) DEFAULT \'PUBLISHED\' NOT NULL');
    }
}
