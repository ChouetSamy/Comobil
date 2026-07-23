<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260721135809 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet ADD name VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE fleet ADD description VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE fleet ADD adress_id INT NOT NULL');
        $this->addSql('ALTER TABLE fleet ADD CONSTRAINT FK_A05E1E478486F9AC FOREIGN KEY (adress_id) REFERENCES adress (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_A05E1E478486F9AC ON fleet (adress_id)');
        $this->addSql('ALTER TABLE vehicle ALTER consumption_liter_per_100km DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet DROP CONSTRAINT FK_A05E1E478486F9AC');
        $this->addSql('DROP INDEX IDX_A05E1E478486F9AC');
        $this->addSql('ALTER TABLE fleet DROP name');
        $this->addSql('ALTER TABLE fleet DROP description');
        $this->addSql('ALTER TABLE fleet DROP adress_id');
        $this->addSql('ALTER TABLE vehicle ALTER consumption_liter_per_100km SET NOT NULL');
    }
}
