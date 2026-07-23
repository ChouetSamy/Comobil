<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260722153001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_info ADD fleet_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_info ALTER user_id DROP NOT NULL');
        $this->addSql('ALTER TABLE user_info ADD CONSTRAINT FK_B1087D9E4B061DF9 FOREIGN KEY (fleet_id) REFERENCES fleet (id) NOT DEFERRABLE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_B1087D9E4B061DF9 ON user_info (fleet_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_info DROP CONSTRAINT FK_B1087D9E4B061DF9');
        $this->addSql('DROP INDEX UNIQ_B1087D9E4B061DF9');
        $this->addSql('ALTER TABLE user_info DROP fleet_id');
        $this->addSql('ALTER TABLE user_info ALTER user_id SET NOT NULL');
    }
}
