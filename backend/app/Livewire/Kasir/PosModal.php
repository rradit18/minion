<?php

namespace App\Livewire\Kasir;

use App\Models\BranchBankAccount;
use App\Models\BranchServicePrice;
use App\Models\Booking;
use App\Models\User;
use App\Services\PromoService;
use App\Services\ReceiptService;
use Livewire\Component;

class PosModal extends Component
{
    // State
    public bool   $isOpen    = false;
    public string $step      = 'review'; // review|promo|tip|payment|confirm|done
    public string $bookingId = '';

    // Booking data (array to avoid Livewire serialization issues)
    public array $booking     = [];
    public array $addons      = [];
    public array $branchServices = [];

    // Promo
    public string  $promoCode    = '';
    public array   $appliedPromo = [];
    public string  $promoError   = '';
    public float   $promoDiscount = 0.0;

    // Tip
    public int    $tipAmount      = 0;
    public string $customTipInput = '';

    // Payment
    public string $paymentMethod  = '';
    public string $amountPaidInput = '';
    public array  $bankAccounts   = [];

    // Derived totals (recomputed on each render)
    public float $subtotal = 0.0;
    public float $total    = 0.0;

    // Done state
    public string  $receiptNumber = '';
    public ?string $receiptId     = null;

    protected $listeners = ['open-pos-modal' => 'open'];

    public function open(string $bookingId): void
    {
        $this->resetState();
        $this->bookingId = $bookingId;
        $this->loadBooking();
        $this->isOpen = true;
    }

    public function close(): void
    {
        $this->isOpen = false;
        $this->resetState();
    }

    private function resetState(): void
    {
        $this->step           = 'review';
        $this->bookingId      = '';
        $this->booking        = [];
        $this->addons         = [];
        $this->branchServices = [];
        $this->promoCode      = '';
        $this->appliedPromo   = [];
        $this->promoError     = '';
        $this->promoDiscount  = 0.0;
        $this->tipAmount      = 0;
        $this->customTipInput = '';
        $this->paymentMethod  = '';
        $this->amountPaidInput = '';
        $this->bankAccounts   = [];
        $this->subtotal       = 0.0;
        $this->total          = 0.0;
        $this->receiptNumber  = '';
        $this->receiptId      = null;
    }

    private function loadBooking(): void
    {
        $b = Booking::with(['services', 'barber:id,name', 'branch:id,name'])
            ->find($this->bookingId);

        if (! $b) return;

        $this->booking = [
            'id'               => $b->id,
            'booking_number'   => $b->booking_number,
            'customer_name'    => $b->customer_name,
            'customer_user_id' => $b->customer_user_id,
            'barber_name'      => $b->barber?->name,
            'branch_name'      => $b->branch?->name,
            'services'         => $b->services->map(fn($s) => [
                'service_id' => $s->service_id,
                'item_name'  => $s->service_name,
                'price'      => (float) $s->price,
            ])->toArray(),
        ];

        $this->computeSubtotal();

        $branchId = auth()->user()->branch_id;

        $this->branchServices = BranchServicePrice::where('branch_id', $branchId)
            ->where('is_active', true)
            ->with('service:id,name,duration_minutes')
            ->get()
            ->map(fn($bsp) => [
                'service_id' => $bsp->service_id,
                'item_name'  => $bsp->service->name,
                'price'      => (float) $bsp->price,
            ])
            ->toArray();

        $this->bankAccounts = BranchBankAccount::where('branch_id', $branchId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['bank_name', 'account_number', 'account_holder'])
            ->toArray();
    }

    public function addAddon(string $serviceId): void
    {
        $svc = collect($this->branchServices)->firstWhere('service_id', $serviceId);
        if (! $svc) return;

        // Avoid duplicate
        if (collect($this->addons)->contains('service_id', $serviceId)) return;

        $this->addons[] = $svc;
        $this->computeSubtotal();
    }

    public function removeAddon(int $index): void
    {
        array_splice($this->addons, $index, 1);
        $this->computeSubtotal();
    }

    private function computeSubtotal(): void
    {
        $bookingTotal    = collect($this->booking['services'] ?? [])->sum('price');
        $addonsTotal     = collect($this->addons)->sum('price');
        $this->subtotal  = $bookingTotal + $addonsTotal;
        $this->total     = max(0, $this->subtotal - $this->promoDiscount);
    }

    public function validatePromo(): void
    {
        $this->promoError = '';

        if (blank($this->promoCode)) {
            $this->promoError = 'Masukkan kode promo.';
            return;
        }

        $kasir    = auth()->user();
        $customer = ! empty($this->booking['customer_user_id'])
            ? User::find($this->booking['customer_user_id'])
            : null;

        try {
            $result = app(PromoService::class)->validate(
                strtoupper(trim($this->promoCode)),
                $this->subtotal,
                $kasir->branch_id,
                $customer,
            );

            $this->appliedPromo  = [
                'id'   => $result['promo']->id,
                'code' => $result['promo']->code,
                'name' => $result['promo']->name,
            ];
            $this->promoDiscount = $result['discount'];
            $this->total         = max(0, $this->subtotal - $this->promoDiscount);
        } catch (\RuntimeException $e) {
            $this->promoError = $e->getMessage();
        }
    }

    public function removePromo(): void
    {
        $this->appliedPromo  = [];
        $this->promoCode     = '';
        $this->promoDiscount = 0.0;
        $this->promoError    = '';
        $this->total         = max(0, $this->subtotal);
    }

    public function setTip(int $amount): void
    {
        $this->tipAmount      = $amount;
        $this->customTipInput = '';
    }

    public function applyCustomTip(): void
    {
        $this->tipAmount = (int) preg_replace('/\D/', '', $this->customTipInput);
    }

    public function setPayment(string $method): void
    {
        $this->paymentMethod   = $method;
        $this->amountPaidInput = '';
    }

    public function nextStep(): void
    {
        $steps   = ['review', 'promo', 'tip', 'payment', 'confirm'];
        $current = array_search($this->step, $steps);

        if ($current !== false && isset($steps[$current + 1])) {
            $this->step = $steps[$current + 1];
        }
    }

    public function prevStep(): void
    {
        $steps   = ['review', 'promo', 'tip', 'payment', 'confirm'];
        $current = array_search($this->step, $steps);

        if ($current > 0) {
            $this->step = $steps[$current - 1];
        }
    }

    public function confirmPayment(): void
    {
        if (! $this->paymentMethod) {
            $this->promoError = 'Pilih metode pembayaran terlebih dahulu.';
            return;
        }

        $kasir      = auth()->user();
        $amountPaid = $this->paymentMethod === 'cash'
            ? (float) preg_replace('/\D/', '', $this->amountPaidInput)
            : $this->total;

        if ($this->paymentMethod === 'cash' && $amountPaid < $this->total) {
            $this->promoError = 'Nominal yang diterima kurang dari total tagihan.';
            return;
        }

        try {
            $receipt = app(ReceiptService::class)->create([
                'booking_id'     => $this->bookingId,
                'kasir_id'       => $kasir->id,
                'branch_id'      => $kasir->branch_id,
                'promo_id'       => $this->appliedPromo['id'] ?? null,
                'promo_discount' => $this->promoDiscount,
                'tip_amount'     => $this->tipAmount,
                'payment_method' => $this->paymentMethod,
                'amount_paid'    => $amountPaid,
                'addons'         => $this->addons,
            ]);

            $this->receiptNumber = $receipt->receipt_number;
            $this->receiptId     = $receipt->id;
            $this->step          = 'done';
            $this->dispatch('booking-updated');
            $this->dispatch('pos-completed');
        } catch (\Exception $e) {
            $this->promoError = 'Gagal membuat struk: ' . $e->getMessage();
        }
    }

    public function getChangeAttribute(): float
    {
        $paid = (float) preg_replace('/\D/', '', $this->amountPaidInput);
        return max(0, $paid - $this->total);
    }

    public function render()
    {
        return view('livewire.kasir.pos-modal', [
            'change' => $this->paymentMethod === 'cash'
                ? max(0, (float) preg_replace('/\D/', '', $this->amountPaidInput) - $this->total)
                : 0,
        ]);
    }
}
