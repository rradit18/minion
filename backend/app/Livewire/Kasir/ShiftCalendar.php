<?php

namespace App\Livewire\Kasir;

use App\Enums\ShiftStatus;
use App\Models\Barber;
use App\Models\BarberShift;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Livewire\Component;

class ShiftCalendar extends Component
{
    public array  $barbers     = [];
    public array  $shifts      = [];
    public string $weekStart   = '';

    // Shift form
    public bool   $showForm      = false;
    public string $formBarberId  = '';
    public string $formDate      = '';
    public string $formShiftId   = '';
    public string $formStartTime = '09:00';
    public string $formEndTime   = '17:00';
    public string $formBreakStart = '';
    public string $formBreakEnd   = '';
    public string $conflictError  = '';
    public string $flashMessage   = '';
    public string $flashType      = '';

    public function mount(): void
    {
        $this->weekStart = today()->startOfWeek()->toDateString();
        $this->loadData();
    }

    public function loadData(): void
    {
        $branchId  = auth()->user()->branch_id;
        $weekStart = Carbon::parse($this->weekStart);
        $weekEnd   = $weekStart->copy()->addDays(6);

        $this->barbers = Barber::whereHas('branchAssignments', fn($q) => $q->where('branch_id', $branchId))
            ->where('is_active', true)
            ->get(['id', 'name', 'signature_color'])
            ->map(fn($b) => [
                'id'    => $b->id,
                'name'  => $b->name,
                'color' => $b->signature_color?->value ?? 'teal',
            ])
            ->toArray();

        $shiftsRaw = BarberShift::where('branch_id', $branchId)
            ->whereBetween('shift_date', [$weekStart->toDateString(), $weekEnd->toDateString()])
            ->get();

        // Index: shifts[$barberId][$date] = shift data
        $this->shifts = [];
        foreach ($shiftsRaw as $shift) {
            $this->shifts[$shift->barber_id][$shift->shift_date->toDateString()] = [
                'id'          => $shift->id,
                'start_time'  => $shift->start_time,
                'end_time'    => $shift->end_time,
                'break_start' => $shift->break_start,
                'break_end'   => $shift->break_end,
                'status'      => $shift->status?->value ?? $shift->status,
            ];
        }
    }

    public function getWeekDates(): array
    {
        $start = Carbon::parse($this->weekStart);
        return collect(CarbonPeriod::create($start, $start->copy()->addDays(6)))
            ->map(fn($d) => ['date' => $d->toDateString(), 'label' => $d->isoFormat('ddd, D MMM')])
            ->toArray();
    }

    public function prevWeek(): void
    {
        $this->weekStart = Carbon::parse($this->weekStart)->subWeek()->toDateString();
        $this->loadData();
    }

    public function nextWeek(): void
    {
        $this->weekStart = Carbon::parse($this->weekStart)->addWeek()->toDateString();
        $this->loadData();
    }

    public function openShiftForm(string $barberId, string $date): void
    {
        $this->formBarberId   = $barberId;
        $this->formDate       = $date;
        $this->conflictError  = '';

        $existing = $this->shifts[$barberId][$date] ?? null;

        if ($existing) {
            $this->formShiftId   = $existing['id'];
            $this->formStartTime = $existing['start_time'];
            $this->formEndTime   = $existing['end_time'];
            $this->formBreakStart = $existing['break_start'] ?? '';
            $this->formBreakEnd   = $existing['break_end'] ?? '';
        } else {
            $this->formShiftId   = '';
            $this->formStartTime = '09:00';
            $this->formEndTime   = '17:00';
            $this->formBreakStart = '';
            $this->formBreakEnd   = '';
        }

        $this->showForm = true;
    }

    public function closeForm(): void
    {
        $this->showForm      = false;
        $this->conflictError = '';
    }

    public function saveShift(): void
    {
        $this->conflictError = '';

        $branchId = auth()->user()->branch_id;

        // Check for conflict at other branches on the same day
        $conflict = BarberShift::where('barber_id', $this->formBarberId)
            ->where('shift_date', $this->formDate)
            ->where('branch_id', '!=', $branchId)
            ->whereNot('status', 'cancelled')
            ->where(fn($q) => $q
                ->where('start_time', '<', $this->formEndTime)
                ->where('end_time', '>', $this->formStartTime)
            )
            ->with('branch:id,name')
            ->first();

        if ($conflict) {
            $this->conflictError = 'Barber sudah ada shift di cabang ' . $conflict->branch->name
                . ' jam ' . $conflict->start_time . '–' . $conflict->end_time . ' pada tanggal ini.';
            return;
        }

        if ($this->formShiftId) {
            BarberShift::find($this->formShiftId)?->update([
                'start_time'  => $this->formStartTime,
                'end_time'    => $this->formEndTime,
                'break_start' => $this->formBreakStart ?: null,
                'break_end'   => $this->formBreakEnd ?: null,
            ]);
            $this->flashMessage = 'Shift diperbarui.';
        } else {
            BarberShift::create([
                'barber_id'   => $this->formBarberId,
                'branch_id'   => $branchId,
                'shift_date'  => $this->formDate,
                'start_time'  => $this->formStartTime,
                'end_time'    => $this->formEndTime,
                'break_start' => $this->formBreakStart ?: null,
                'break_end'   => $this->formBreakEnd ?: null,
                'status'      => ShiftStatus::Scheduled,
            ]);
            $this->flashMessage = 'Shift ditambahkan.';
        }

        $this->flashType = 'success';
        $this->showForm  = false;
        $this->loadData();
    }

    public function cancelShift(): void
    {
        if (! $this->formShiftId) {
            return;
        }

        BarberShift::find($this->formShiftId)?->update(['status' => ShiftStatus::Cancelled]);

        $this->flashMessage = 'Shift dibatalkan.';
        $this->flashType    = 'warning';
        $this->showForm     = false;
        $this->loadData();
    }

    public function render()
    {
        return view('livewire.kasir.shift-calendar', [
            'weekDates' => $this->getWeekDates(),
        ]);
    }
}
