<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260721141553 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet DROP CONSTRAINT fk_a05e1e47a76ed395');
        $this->addSql('DROP INDEX idx_a05e1e47a76ed395');
        $this->addSql('ALTER TABLE fleet ALTER description DROP NOT NULL');
        $this->addSql('ALTER TABLE fleet RENAME COLUMN user_id TO user_info_id');
        $this->addSql('ALTER TABLE fleet ADD CONSTRAINT FK_A05E1E47586DFF2 FOREIGN KEY (user_info_id) REFERENCES user_info (id) NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A05E1E475E237E06 ON fleet (name)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_A05E1E47586DFF2 ON fleet (user_info_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet DROP CONSTRAINT FK_A05E1E47586DFF2');
        $this->addSql('DROP INDEX UNIQ_A05E1E475E237E06');
        $this->addSql('DROP INDEX UNIQ_A05E1E47586DFF2');
        $this->addSql('ALTER TABLE fleet ALTER description SET NOT NULL');
        $this->addSql('ALTER TABLE fleet RENAME COLUMN user_info_id TO user_id');
        $this->addSql('ALTER TABLE fleet ADD CONSTRAINT fk_a05e1e47a76ed395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_a05e1e47a76ed395 ON fleet (user_id)');
    }
}
