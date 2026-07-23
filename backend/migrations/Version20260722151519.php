<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260722151519 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet DROP CONSTRAINT fk_a05e1e47586dff2');
        $this->addSql('DROP INDEX uniq_a05e1e47586dff2');
        $this->addSql('ALTER TABLE fleet DROP user_info_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fleet ADD user_info_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE fleet ADD CONSTRAINT fk_a05e1e47586dff2 FOREIGN KEY (user_info_id) REFERENCES user_info (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX uniq_a05e1e47586dff2 ON fleet (user_info_id)');
    }
}
