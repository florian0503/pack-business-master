<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Reservation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Reservation>
 */
class ReservationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reservation::class);
    }

    /**
     * @return Reservation[]
     */
    public function findByWeek(\DateTimeImmutable $weekStart): array
    {
        $weekEnd = $weekStart->modify('+7 days');

        return $this->createQueryBuilder('r')
            ->where('r.date >= :start')
            ->andWhere('r.date < :end')
            ->setParameter('start', $weekStart)
            ->setParameter('end', $weekEnd)
            ->orderBy('r.date', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
