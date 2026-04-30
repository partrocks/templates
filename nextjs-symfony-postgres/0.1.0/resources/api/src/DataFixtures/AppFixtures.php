<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Quote;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $items = [
            ['content' => 'I told my wife she was drawing her eyebrows too high. She looked surprised.', 'author' => null],
            ['content' => 'I’m reading a book about anti-gravity. It’s impossible to put down.', 'author' => null],
            ['content' => 'The early bird might get the worm, but the second mouse gets the cheese.', 'author' => 'Steven Wright'],
            ['content' => 'I used to play piano by ear, but now I use my hands.', 'author' => null],
            ['content' => 'My dog used to chase people on a bike a lot. It got so bad, finally I had to take his bike away.', 'author' => null],
            ['content' => 'I have a stepladder because my real ladder left when I was a kid.', 'author' => 'Mitch Hedberg'],
            ['content' => 'If at first you don’t succeed, then skydiving definitely isn’t for you.', 'author' => null],
            ['content' => 'I’m on a seafood diet. I see food and I eat it.', 'author' => null],
            ['content' => 'Velcro — what a rip-off.', 'author' => null],
            ['content' => 'I’m not lazy, I’m on energy-saving mode.', 'author' => null],
            ['content' => 'Never trust atoms; they make up everything.', 'author' => null],
            ['content' => 'My imaginary friend says you have serious problems.', 'author' => null],
            ['content' => 'I’m great at multitasking. I can waste time, be unproductive, and procrastinate all at once.', 'author' => null],
            ['content' => 'Before you criticize someone, walk a mile in their shoes. That way, when you criticize them, you’ll be a mile away and have their shoes.', 'author' => 'Jack Handey'],
            ['content' => 'I used to think I was indecisive, but now I’m not so sure.', 'author' => null],
            ['content' => 'The best thing about teamwork is you always have someone else to blame.', 'author' => null],
            ['content' => 'I’d give my right arm to be ambidextrous.', 'author' => null],
            ['content' => 'I have a lot of growing up to do. I realized that the other day inside my fort.', 'author' => 'Zach Galifianakis'],
            ['content' => 'I don’t suffer from insanity — I enjoy every minute of it.', 'author' => null],
            ['content' => 'I was addicted to the hokey pokey, but I turned myself around.', 'author' => null],
        ];

        foreach ($items as $row) {
            $quote = (new Quote())
                ->setContent($row['content'])
                ->setAuthor($row['author']);
            $manager->persist($quote);
        }

        $manager->flush();
    }
}
