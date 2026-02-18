<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReservationController extends AbstractController
{
    #[Route('/reservation', name: 'app_reservation')]
    public function index(): Response
    {
        return $this->render('reservation/index.html.twig');
    }

    #[Route('/api/reservation/slots', name: 'api_reservation_slots', methods: ['GET'])]
    public function slots(Request $request, ReservationRepository $repository): JsonResponse
    {
        $weekParam = $request->query->getString('week', '');
        $weekStart = $this->parseWeekStart($weekParam);

        $reservations = $repository->findByWeek($weekStart);

        $slots = [];
        foreach ($reservations as $reservation) {
            $date = $reservation->getDate();
            if (null === $date) {
                continue;
            }
            $key = $date->format('Y-m-d H:i');
            $user = $reservation->getUser();
            $slots[$key] = [
                'id' => $reservation->getId(),
                'userId' => $user?->getId(),
                'userName' => $user ? $user->getFirstName() . ' ' . $user->getLastName() : null,
            ];
        }

        return $this->json([
            'weekStart' => $weekStart->format('Y-m-d'),
            'slots' => $slots,
        ]);
    }

    #[Route('/api/reservation/book', name: 'api_reservation_book', methods: ['POST'])]
    public function book(Request $request, EntityManagerInterface $em, ReservationRepository $repository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Vous devez être connecté pour réserver.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $datetime = $data['datetime'] ?? null;

        if (!$datetime || !is_string($datetime)) {
            return $this->json(['error' => 'Date et heure requises.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $date = new \DateTimeImmutable($datetime);
        } catch (\Exception) {
            return $this->json(['error' => 'Format de date invalide.'], Response::HTTP_BAD_REQUEST);
        }

        if ($date < new \DateTimeImmutable('now')) {
            return $this->json(['error' => 'Impossible de réserver un créneau passé.'], Response::HTTP_BAD_REQUEST);
        }

        $weekStart = $this->parseWeekStart($date->format('Y-m-d'));
        $existing = $repository->findByWeek($weekStart);
        foreach ($existing as $reservation) {
            if ($reservation->getDate()?->format('Y-m-d H:i') === $date->format('Y-m-d H:i')) {
                return $this->json(['error' => 'Ce créneau est déjà réservé.'], Response::HTTP_CONFLICT);
            }
        }

        /** @var \App\Entity\User $user */
        $reservation = new Reservation();
        $reservation->setDate($date);
        $reservation->setUser($user);

        $em->persist($reservation);
        $em->flush();

        return $this->json(['success' => true, 'id' => $reservation->getId()], Response::HTTP_CREATED);
    }

    #[Route('/api/reservation/cancel', name: 'api_reservation_cancel', methods: ['POST'])]
    public function cancel(Request $request, EntityManagerInterface $em, ReservationRepository $repository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Vous devez être connecté.'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $id = $data['id'] ?? null;

        if (!$id) {
            return $this->json(['error' => 'ID de réservation requis.'], Response::HTTP_BAD_REQUEST);
        }

        $reservation = $repository->find($id);
        if (!$reservation) {
            return $this->json(['error' => 'Réservation introuvable.'], Response::HTTP_NOT_FOUND);
        }

        /** @var \App\Entity\User $user */
        if ($reservation->getUser()?->getId() !== $user->getId()) {
            return $this->json(['error' => 'Vous ne pouvez annuler que vos propres réservations.'], Response::HTTP_FORBIDDEN);
        }

        $em->remove($reservation);
        $em->flush();

        return $this->json(['success' => true]);
    }

    private function parseWeekStart(string $dateStr): \DateTimeImmutable
    {
        try {
            $date = new \DateTimeImmutable($dateStr);
        } catch (\Exception) {
            $date = new \DateTimeImmutable();
        }

        $dayOfWeek = (int) $date->format('N');

        return $date->modify('-' . ($dayOfWeek - 1) . ' days')->setTime(0, 0);
    }
}
