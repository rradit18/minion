<?php

namespace App\Livewire\Kasir;

use App\Models\Booking;
use App\Models\Receipt;
use App\Models\BarberShift;
use Livewire\Component;

class QuickStats extends Component
{
    public int $transactionCount = 0;
    public float $totalRevenue   = 0;
    public int $onShiftCount     = 0;

    public function mount(): void
    {
        $this->loadStats();
    }

    public function loadStats(): void
    {
        $branchId = auth()->user()->branch_id;

        $this->transactionCount = Receipt::where('branch_id', $branchId)
            ->whereDate('created_at', today())
            ->count();

        $this->totalRevenue = (float) Receipt::where('branch_id', $branchId)
            ->whereDate('created_at', today())
            ->sum('total');

        $this->onShiftCount = BarberShift::where('branch_id', $branchId)
            ->where('shift_date', today())
            ->whereNotIn('status', ['cancelled'])
            ->count();
    }

    public function render()
    {
        $this->loadStats();

        return view('livewire.kasir.quick-stats');
    }
}
