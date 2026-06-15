<div
    wire:poll.10s="check"
    wire:key="booking-notifier"
    x-data="{
        notify() {
            // Pakai file suara kustom bila tersedia di public/sounds/notification.mp3,
            // jika tidak ada / gagal diputar, fallback ke chime sintetis.
            try {
                const audio = new Audio('{{ asset('sounds/notification.mp3') }}');
                audio.volume = 0.6;
                audio.play().catch(() => this.chime());
            } catch (e) {
                this.chime();
            }
        },
        chime() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                if (ctx.state === 'suspended') ctx.resume();
                const ding = (start, freq) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g); g.connect(ctx.destination);
                    o.type = 'sine';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
                    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + start + 0.01);
                    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + 0.6);
                    o.start(ctx.currentTime + start);
                    o.stop(ctx.currentTime + start + 0.62);
                };
                ding(0, 988);     // B5
                ding(0.18, 1319); // E6 — ding-dong
            } catch (e) {}
        }
    }"
    x-on:new-booking.window="notify()"
    style="display:none;"
></div>
