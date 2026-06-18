<div class="mt-4 flex items-center justify-center gap-3">
    @foreach($panelLinks as $link)
    <a href="{{ $link['url'] }}"
       class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/25 transition-all">
        {{ $link['label'] }}
    </a>
    @endforeach
</div>
