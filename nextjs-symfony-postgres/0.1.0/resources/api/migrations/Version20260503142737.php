<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Template-generated Migration: Please modify to your needs!
 */
final class Version20260503142737 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create quotes table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE quotes (id SERIAL NOT NULL, content TEXT NOT NULL, author VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE quotes');
    }
}
