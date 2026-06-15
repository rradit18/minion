<?php

namespace App\Livewire\Kasir;

use App\Models\BarberShift;
use App\Models\BranchServicePrice;
use App\Models\User;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use Livewire\Component;

class WalkinForm extends Component
{
    public int    $step           = 1;
    public string $phone          = '';
    public ?array $foundUser      = null;
    public bool   $isGuest        = false;
    public string $guestName      = '';
    public array  $selectedServices = [];
    public string $selectedBarberId = '';
    public string $selectedSlot     = '';
    public array  $availableBarbers = [];
    public array  $availableSlots   = [];
    public array  $services         = [];
    public bool   $loading          = false;
    public string $flashMessage     = '';
    public string $flashType        = '';

    public function mount(): void
    {
        $branchId = auth()->user()->branch_id;

        $this->services = BranchServicePrice::where('branch_id', $branchId)
            ->where('is_active', true)
            ->with('service:id,name,duration_minutes')
            ->get()
            ->map(fn($bsp) => [
                'id'               => $bsp->service_id,
                'name'             => $bsp->service->name,
                'price'            => (float) $bsp->price,
                'duration_minutes' => $bsp->service->duration_minutes,
            ])
            ->toArray();
    }

    public function searchUser(): void
    {
        $this->foundUser = null;
        $this->isGuest   = false;

        if (strlen($this->phone) < 8) {
            return;
        }

        $user = User::where('phone', $this->phone)->where('role', 'customer')->first();

        if ($user) {
            $this->foundUser = ['id' => $user->id, 'name' => $user->name, 'phone' => $user->phone];
        }
    }

    public function useGuest(): void
    {
        $this->isGuest = true;
        $this->step    = 2;
    }

    public function useFoundUser(): void
    {
        $this->isGuest = false;
        $this->step    = 2;
    }

    public function nextStep(): void
    {
        if ($this->step === 2) {
            if (empty($this->selectedServices)) {
                $this->flashMessage = 'Pilih minimal 1 layanan.';
                $this->flashType    = 'error';
                return;
            }
            $this->loadAvailableBarbers();
            $this->step = 3;
        } elseif ($this->step === 3) {
            if (! $this->selectedBarberId || ! $this->selectedSlot) {
                $this->flashMessage = 'Pilih barber dan slot waktu.';
                $this->flashType    = 'error';
                return;
            }
            $this->step = 4;
        }

        $this->flashMessage = '';
    }

    public function prevStep(): void
    {
        if ($this->step > 1) {
            $this->step--;
            $this->flashMessage = '';
        }
    }

    public function updatedSelectedBarberId(): void
    {
        $this->selectedSlot    = '';
        $this->availableSlots  = [];

        if ($this->selectedBarberId) {
            $this->loadSlots();
        }
    }

    private function loadAvailableBarbers(): void
    {
        $branchId = auth()->user()->branch_id;

        $this->availableBarbers = BarberShift::where('branch_id', $branchId)
            ->where('shift_date', today())
            ->whereNot('status', 'cancelled')
            ->with('barber:id,name,signature_color')
            ->get()
            ->map(fn($shift) => [
                'id'   => $shift->barber_id,
                'name' => $shift->barber->name,
                'color' => $shift->barber->signature_color?->value ?? 'teal',
            ])
            ->unique('id')
            ->values()
            ->toArray();
    }

    private function loadSlots(): void
    {
        $availability = app(AvailabilityService::class);

        $this->availableSlots = $availability->getAvailableSlots(
            $this->selectedBarberId,
            today()->toDateString(),
            $this->selectedServices
        );
    }

    public function submit(): void
    {
        if ($this->isGuest && blank($this->guestName)) {
            $this->flashMessage = 'Nama tamu wajib diisi.';
            $this->flashType    = 'error';
            return;
        }

        $customerUserId = $this->foundUser['id'] ?? null;
        $customerName   = $this->foundUser['name'] ?? $this->guestName;
        $customerPhone  = $this->foundUser['phone'] ?? $this->phone;
        $branchId       = auth()->user()->branch_id;

        try {
            $booking = app(BookingService::class)->createWalkinBooking([
                'branch_id'    => $branchId,
                'barber_id'    => $this->selectedBarberId,
                'service_ids'  => $this->selectedServices,
                'scheduled_at' => $this->selectedSlot,
                'customer_name'  => $customerName,
                'customer_phone' => $customerPhone,
            ], $customerUserId);

            $this->flashMessage = 'Walk-in booking #' . $booking->booking_number . ' berhasil dibuat.';
            $this->flashType    = 'success';
            $this->resetForm();
            $this->dispatch('booking-updated');
        } catch (\Exception $e) {
            $this->flashMessage = 'Gagal membuat booking: ' . $e->getMessage();
            $this->flashType    = 'error';
        }
    }

    private function resetForm(): void
    {
        $this->step              = 1;
        $this->phone             = '';
        $this->foundUser         = null;
        $this->isGuest           = false;
        $this->guestName         = '';
        $this->selectedServices  = [];
        $this->selectedBarberId  = '';
        $this->selectedSlot      = '';
        $this->availableBarbers  = [];
        $this->availableSlots    = [];
    }

    public function render()
    {
        return view('livewire.kasir.walkin-form');
    }
}
