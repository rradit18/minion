<?php

namespace App\Livewire\Kasir;

use App\Enums\ProductCategory;
use App\Models\BranchBankAccount;
use App\Models\Product;
use App\Services\ReceiptService;
use Livewire\Component;

class ProductSale extends Component
{
    /** @var array<int, array{id:string,name:string,price:float,stock:int}> */
    public array $products = [];

    /** @var array<int, array{product_id:string,name:string,price:float,quantity:int,stock:int}> */
    public array $cart = [];

    public string $search   = '';
    public string $category = '';

    public string $paymentMethod   = '';
    public string $amountPaidInput = '';
    public array  $bankAccounts    = [];

    public bool    $done          = false;
    public string  $receiptNumber = '';
    public ?string $receiptId     = null;
    public string  $error         = '';

    public function mount(): void
    {
        $this->loadProducts();

        $branchId = auth()->user()->branch_id;
        $this->bankAccounts = BranchBankAccount::where('branch_id', $branchId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['bank_name', 'account_number', 'account_holder'])
            ->toArray();
    }

    public function loadProducts(): void
    {
        $branchId = auth()->user()->branch_id;

        $this->products = Product::where('branch_id', $branchId)
            ->where('is_active', true)
            ->where('stock_qty', '>', 0)
            ->orderBy('name')
            ->get(['id', 'name', 'image_path', 'category', 'price', 'stock_qty'])
            ->map(fn($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'image'    => $p->image_path ? \Illuminate\Support\Facades\Storage::disk('public')->url($p->image_path) : null,
                'category' => $p->category?->value,
                'price'    => (float) $p->price,
                'stock'    => $p->stock_qty,
            ])
            ->toArray();
    }

    public function addToCart(string $productId): void
    {
        $this->error = '';

        $product = collect($this->products)->firstWhere('id', $productId);
        if (! $product) {
            return;
        }

        foreach ($this->cart as $i => $item) {
            if ($item['product_id'] === $productId) {
                if ($this->cart[$i]['quantity'] < $product['stock']) {
                    $this->cart[$i]['quantity']++;
                } else {
                    $this->error = "Stok {$product['name']} hanya tersisa {$product['stock']}.";
                }
                return;
            }
        }

        $this->cart[] = [
            'product_id' => $product['id'],
            'name'       => $product['name'],
            'price'      => $product['price'],
            'quantity'   => 1,
            'stock'      => $product['stock'],
        ];
    }

    public function incQty(int $index): void
    {
        if (! isset($this->cart[$index])) {
            return;
        }

        if ($this->cart[$index]['quantity'] < $this->cart[$index]['stock']) {
            $this->cart[$index]['quantity']++;
        } else {
            $this->error = "Stok {$this->cart[$index]['name']} hanya tersisa {$this->cart[$index]['stock']}.";
        }
    }

    public function decQty(int $index): void
    {
        if (! isset($this->cart[$index])) {
            return;
        }

        $this->cart[$index]['quantity']--;
        if ($this->cart[$index]['quantity'] < 1) {
            $this->removeItem($index);
        }
    }

    public function removeItem(int $index): void
    {
        array_splice($this->cart, $index, 1);
    }

    public function setCategory(string $category): void
    {
        $this->category = $category;
    }

    public function setPayment(string $method): void
    {
        $this->paymentMethod   = $method;
        $this->amountPaidInput = '';
        $this->error           = '';
    }

    private function subtotal(): float
    {
        return collect($this->cart)->sum(fn($item) => $item['price'] * $item['quantity']);
    }

    public function checkout(): void
    {
        $this->error = '';

        if (empty($this->cart)) {
            $this->error = 'Keranjang masih kosong.';
            return;
        }

        if (! $this->paymentMethod) {
            $this->error = 'Pilih metode pembayaran terlebih dahulu.';
            return;
        }

        $total = $this->subtotal();

        $amountPaid = $this->paymentMethod === 'cash'
            ? (float) preg_replace('/\D/', '', $this->amountPaidInput)
            : $total;

        if ($this->paymentMethod === 'cash' && $amountPaid < $total) {
            $this->error = 'Nominal yang diterima kurang dari total.';
            return;
        }

        try {
            $receipt = app(ReceiptService::class)->createProductSale([
                'kasir_id'       => auth()->id(),
                'branch_id'      => auth()->user()->branch_id,
                'items'          => array_map(fn($item) => [
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                ], $this->cart),
                'payment_method' => $this->paymentMethod,
                'amount_paid'    => $amountPaid,
            ]);
        } catch (\RuntimeException $e) {
            $this->error = $e->getMessage();
            $this->loadProducts();
            return;
        }

        $this->receiptNumber = $receipt->receipt_number;
        $this->receiptId     = $receipt->id;
        $this->done          = true;

        $this->dispatch('product-sale-completed');
    }

    public function newSale(): void
    {
        $this->cart            = [];
        $this->paymentMethod   = '';
        $this->amountPaidInput = '';
        $this->done            = false;
        $this->receiptNumber   = '';
        $this->receiptId       = null;
        $this->error           = '';
        $this->loadProducts();
    }

    public function render()
    {
        $products = array_values(array_filter($this->products, function ($p) {
            $matchesSearch   = $this->search === '' || stripos($p['name'], $this->search) !== false;
            $matchesCategory = $this->category === '' || ($p['category'] ?? null) === $this->category;
            return $matchesSearch && $matchesCategory;
        }));

        $subtotal = $this->subtotal();
        $paid     = (float) preg_replace('/\D/', '', $this->amountPaidInput);

        return view('livewire.kasir.product-sale', [
            'visibleProducts' => $products,
            'categories'      => ProductCategory::options(),
            'subtotal'        => $subtotal,
            'change'          => max(0, $paid - $subtotal),
        ]);
    }
}
